import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import BarcodeScanner from '../components/BarcodeScanner';

type RootStackParamList = { Home: undefined };
interface Veiculo { id: number; placa: string; chassi: string; }
interface Localizacao { id: number; armazem: string; rua: string; modulo: string; compartimento: string; }

const Recebimento: React.FC = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [scanningType, setScanningType] = useState<'none' | 'veiculo' | 'local'>('none');
  const [veiculoEncontrado, setVeiculoEncontrado] = useState<Veiculo | null>(null);
  const [localizacaoEncontrada, setLocalizacaoEncontrada] = useState<Localizacao | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string>('');
  const [manualInputVeiculo, setManualInputVeiculo] = useState('');
  const [manualInputLocalizacao, setManualInputLocalizacao] = useState({ armazem: '', rua: '', modulo: '', compartimento: '' });

  // Callback do leitor de QR Code
  const handleBarcodeScanned = (data: string) => {
    setScanningType('none');
    try {
      const parsedData = JSON.parse(data);
      if (scanningType === 'veiculo' && parsedData.id && parsedData.placa) {
        setVeiculoEncontrado(parsedData);
        setMensagem(`Veículo ${parsedData.placa} identificado via QR Code!`);
      } else if (scanningType === 'local' && parsedData.id && parsedData.armazem) {
        setLocalizacaoEncontrada(parsedData);
        setMensagem(`Local ${parsedData.armazem} identificado via QR Code!`);
      } else {
        Alert.alert('Erro', 'QR Code não corresponde ao tipo esperado.');
      }
    } catch {
      Alert.alert('Erro', 'QR Code com formato inválido.');
    }
  };

  // Buscar veículo manualmente
  const buscarVeiculoManual = async () => {
    if (!manualInputVeiculo.trim()) {
      Alert.alert('Aviso', 'Digite a placa, chassi ou contrato do veículo');
      return;
    }

    setIsLoading(true);
    setMensagem('');
    try {
      const result = await api.searchVehicle(manualInputVeiculo);
      setVeiculoEncontrado(result.veiculo);
      setMensagem(`Veículo ${result.veiculo.placa} encontrado!`);
    } catch {
      setMensagem('Veículo não encontrado.');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar localização manualmente
  const buscarLocalizacaoManual = async () => {
    if (!manualInputLocalizacao.armazem.trim()) {
      Alert.alert('Aviso', 'Digite pelo menos o armazém');
      return;
    }

    setIsLoading(true);
    setMensagem('');
    try {
      const result = await api.searchLocation(manualInputLocalizacao);
      setLocalizacaoEncontrada(result);
      setMensagem(`Localização ${result.armazem} encontrada!`);
    } catch {
      setMensagem('Localização não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };

  // Armazenar veículo no local
  const handleArmazenar = async () => {
    if (!veiculoEncontrado || !localizacaoEncontrada) return;
    setIsLoading(true);
    setMensagem('');

    try {
      await api.createHistory(veiculoEncontrado.id, localizacaoEncontrada.id);
      setMensagem(`Veículo ${veiculoEncontrado.placa} armazenado com sucesso!`);
      setTimeout(() => {
        setVeiculoEncontrado(null);
        setLocalizacaoEncontrada(null);
        setManualInputVeiculo('');
        setManualInputLocalizacao({ armazem: '', rua: '', modulo: '', compartimento: '' });
        setMensagem('');
      }, 5000);
    } catch (error: any) {
      setMensagem(`Erro: ${error.message || 'Falha ao guardar o registro.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Exibir o leitor QR (quando ativo)
  if (scanningType !== 'none' && Platform.OS !== 'web') {
    return (
      <BarcodeScanner
        onBarcodeScanned={handleBarcodeScanned}
        onClose={() => setScanningType('none')}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Recebimento de Veículo</Text>

      {/* SEÇÃO VEÍCULO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {veiculoEncontrado ? `✓ Veículo: ${veiculoEncontrado.placa}` : '1. Identificar Veículo'}
        </Text>

        {!veiculoEncontrado ? (
          <>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Placa, Chassi ou Contrato"
                placeholderTextColor={theme.colors.border}
                value={manualInputVeiculo}
                onChangeText={setManualInputVeiculo}
              />
              <TouchableOpacity style={styles.searchButton} onPress={buscarVeiculoManual}>
                <Text style={styles.searchButtonText}>BUSCAR</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setScanningType('veiculo')}
            >
              <Text style={styles.buttonText}>LER QR CODE DO VEÍCULO</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.clearButton} onPress={() => setVeiculoEncontrado(null)}>
            <Text style={styles.clearButtonText}>LIMPAR VEÍCULO</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SEÇÃO LOCAL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {localizacaoEncontrada ? `✓ Local: ${localizacaoEncontrada.armazem}` : '2. Identificar Localização'}
        </Text>

        {!localizacaoEncontrada ? (
          <>
            {['armazem', 'rua', 'modulo', 'compartimento'].map((campo) => (
              <TextInput
                key={campo}
                style={styles.input}
                placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                placeholderTextColor={theme.colors.border}
                value={manualInputLocalizacao[campo as keyof typeof manualInputLocalizacao]}
                onChangeText={(t) =>
                  setManualInputLocalizacao((p) => ({ ...p, [campo]: t }))
                }
              />
            ))}

            <TouchableOpacity style={styles.searchButtonFull} onPress={buscarLocalizacaoManual}>
              <Text style={styles.searchButtonText}>BUSCAR LOCAL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setScanningType('local')}
            >
              <Text style={styles.buttonText}>LER QR CODE DO LOCAL</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.clearButton} onPress={() => setLocalizacaoEncontrada(null)}>
            <Text style={styles.clearButtonText}>LIMPAR LOCAL</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MENSAGEM / LOADING */}
      {!!mensagem && <Text style={styles.message}>{mensagem}</Text>}
      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />}

      {/* BOTÕES FINAIS */}
      {veiculoEncontrado && localizacaoEncontrada && !isLoading && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleArmazenar}>
          <Text style={styles.confirmButtonText}>✓ ARMAZENAR VEÍCULO</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>VOLTAR</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
    </ScrollView>
  );
};

export default Recebimento;

// ======== ESTILOS ========
const getStyles = (theme: any) => StyleSheet.create({
    scroll: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 25,
    },
    section: {
      width: '100%',
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 15,
      textAlign: 'center',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 20,
      color: theme.colors.text,
      fontSize: 16,
      marginBottom: 12,
    },
    searchButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginLeft: 8,
    },
    searchButtonFull: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 10,
    },
    searchButtonText: {
      color: theme.colors.background,
      fontWeight: 'bold',
      fontSize: 14,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: theme.colors.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    clearButton: {
      marginTop: 10,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: theme.colors.error,
      alignItems: 'center',
    },
    clearButtonText: {
      color: theme.colors.error,
      fontWeight: 'bold',
      fontSize: 14,
    },
    message: {
      textAlign: 'center',
      color: theme.colors.text,
      marginVertical: 15,
      fontWeight: 'bold',
      fontSize: 16,
    },
    confirmButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 15,
      borderRadius: 25,
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
    confirmButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    backButton: {
      marginTop: 15,
      padding: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      width: '100%',
    },
    backButtonText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    footer: {
      textAlign: 'center',
      color: theme.colors.border,
      fontSize: 12,
      marginTop: 25,
    },
  });
