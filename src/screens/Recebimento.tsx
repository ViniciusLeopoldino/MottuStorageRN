import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView 
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
// import BarcodeScanner from '../components/BarcodeScanner';

type RootStackParamList = { Home: undefined };
interface Veiculo { id: number; placa: string; chassi: string; }
interface Localizacao { id: number; armazem: string; rua: string; modulo: string; compartimento: string; }

const Recebimento: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [scanningType, setScanningType] = useState<'none' | 'veiculo' | 'local'>('none');
  const [veiculoEncontrado, setVeiculoEncontrado] = useState<Veiculo | null>(null);
  const [localizacaoEncontrada, setLocalizacaoEncontrada] = useState<Localizacao | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string>('');
  const [webInputVeiculo, setWebInputVeiculo] = useState('');
  const [webInputLocalizacao, setWebInputLocalizacao] = useState({ armazem: '', rua: '', modulo: '', compartimento: '' });

  // Função para processar código escaneado
  const handleBarcodeScanned = (data: string) => {
    setScanningType('none');
    try {
      const parsedData = JSON.parse(data);
      if (scanningType === 'veiculo' && parsedData.id && parsedData.placa) {
        setVeiculoEncontrado(parsedData);
        setMensagem(`Veículo ${parsedData.placa} identificado!`);
      } else if (scanningType === 'local' && parsedData.id && parsedData.armazem) {
        setLocalizacaoEncontrada(parsedData);
        setMensagem(`Local ${parsedData.armazem}-${parsedData.rua} identificado!`);
      } else {
        Alert.alert('Erro', 'QR Code inválido ou não corresponde ao tipo esperado.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível ler o QR Code. O formato é inválido.');
    }
  };

  const handleWebSearch = async (type: 'veiculo' | 'local') => {
    setIsLoading(true);
    setMensagem('');
    try {
      if (type === 'veiculo') {
        if (!webInputVeiculo) throw new Error('Preencha o campo do veículo.');
        const result = await api.searchVehicle(webInputVeiculo);

        setVeiculoEncontrado(result.veiculo);
        setMensagem(`Veículo ${result.veiculo.placa} encontrado!`);

      } else {
        if (!webInputLocalizacao.armazem) throw new Error('Preencha os campos da localização.');
        const result = await api.searchLocation(webInputLocalizacao);

        setLocalizacaoEncontrada(result);
        setMensagem(`Localização ${result.armazem} encontrada!`);
      }
    } catch (error) {
      setMensagem(type === 'veiculo' ? 'Veículo não encontrado.' : 'Localização não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleArmazenar = async () => {
    if (!veiculoEncontrado || !localizacaoEncontrada) return;
    setIsLoading(true);
    setMensagem(''); 

    try {
      await api.createHistory(veiculoEncontrado.id, localizacaoEncontrada.id);

      setMensagem(`Veículo ${veiculoEncontrado.placa} armazenado com sucesso na localização ${localizacaoEncontrada.armazem}-${localizacaoEncontrada.rua}-${localizacaoEncontrada.modulo}-${localizacaoEncontrada.compartimento}!`);

      setTimeout(() => {
        setVeiculoEncontrado(null);
        setLocalizacaoEncontrada(null);
        setWebInputVeiculo('');
        setWebInputLocalizacao({ armazem: '', rua: '', modulo: '', compartimento: '' });
        setMensagem(''); 
      }, 5000); 
      
    } catch (error: any) {
      setMensagem(`Erro: ${error.message || 'Não foi possível guardar o registo.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Se estiver escaneando, mostrar o componente scanner
  // if (scanningType !== 'none' && Platform.OS !== 'web') {
  //   return (
  //     <BarcodeScanner 
  //       onBarcodeScanned={handleBarcodeScanned}
  //       onClose={() => setScanningType('none')}
  //     />
  //   );
  // }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>RECEBIMENTO DE VEÍCULO</Text>

          {Platform.OS === 'web' ? (
            <>
              <Text style={styles.label}>{veiculoEncontrado ? `Veículo: ${veiculoEncontrado.placa}` : '1. IDENTIFICAR VEÍCULO'}</Text>
              <TextInput style={styles.input} placeholder='Insira Placa, Chassi ou Contrato' value={webInputVeiculo} onChangeText={setWebInputVeiculo} />
              <TouchableOpacity style={styles.button} onPress={() => handleWebSearch('veiculo')}>
                <Text style={styles.buttonText}>Procurar Veículo</Text>
              </TouchableOpacity>

              <Text style={styles.label}>{localizacaoEncontrada ? `Local: ${localizacaoEncontrada.armazem}` : '2. IDENTIFICAR LOCALIZAÇÃO'}</Text>
              <TextInput style={styles.input} placeholder='Armazém' value={webInputLocalizacao.armazem} onChangeText={t => setWebInputLocalizacao(p => ({...p, armazem: t}))} />
              <TextInput style={styles.input} placeholder='Rua' value={webInputLocalizacao.rua} onChangeText={t => setWebInputLocalizacao(p => ({...p, rua: t}))} />
              <TextInput style={styles.input} placeholder='Módulo' value={webInputLocalizacao.modulo} onChangeText={t => setWebInputLocalizacao(p => ({...p, modulo: t}))} />
              <TextInput style={styles.input} placeholder='Compartimento' value={webInputLocalizacao.compartimento} onChangeText={t => setWebInputLocalizacao(p => ({...p, compartimento: t}))} />
              <TouchableOpacity style={styles.button} onPress={() => handleWebSearch('local')}>
                <Text style={styles.buttonText}>Procurar Localização</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={() => setScanningType('veiculo')}>
                <Text style={styles.buttonText}>{veiculoEncontrado ? `Veículo: ${veiculoEncontrado.placa}` : '1. LER QR CODE DO VEÍCULO'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setScanningType('local')}>
                <Text style={styles.buttonText}>{localizacaoEncontrada ? `Local: ${localizacaoEncontrada.armazem}` : '2. LER QR CODE DO LOCAL'}</Text>
              </TouchableOpacity>
            </>
          )}
          
          {!!mensagem && <Text style={styles.message}>{mensagem}</Text>}
          {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 14 }} />}
          
          {veiculoEncontrado && localizacaoEncontrada && !isLoading && (
            <TouchableOpacity style={styles.button} onPress={handleArmazenar}>
              <Text style={styles.buttonText}>ARMAZENAR</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 50 },
    container: { width: '100%', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 20 },
    label: { color: theme.colors.text, alignSelf: 'flex-start', marginLeft: 15, marginTop: 20, marginBottom: 5, fontSize: 16, fontWeight: 'bold' },
    input: { width: '100%', borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20, color: theme.colors.text, fontSize: 16, marginBottom: 10 },
    button: { backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, width: '100%' },
    buttonText: { color: theme.colors.background, fontSize: 16, fontWeight: 'bold' },
    backButton: { marginTop: 20, padding: 12, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center', width: '100%' },
    backButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
    message: { color: theme.colors.text, marginTop: 20, textAlign: 'center', fontWeight: 'bold' },
    footer: { textAlign: 'center', color: theme.colors.border, fontSize: 12, width: '100%', marginTop: 20 },
});

export default Recebimento;