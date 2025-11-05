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
import BarcodeScanner from '../components/BarcodeScanner';

type RootStackParamList = { Home: undefined };
interface Veiculo { id: number; placa: string; chassi: string; }
interface Localizacao { id: number; armazem: string; rua: string; modulo: string; compartimento: string; }

const Recebimento: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [scanningType, setScanningType] = useState<'none' | 'veiculo' | 'local'>('none');
  const [inputType, setInputType] = useState<'qr' | 'manual'>('manual');
  const [veiculoEncontrado, setVeiculoEncontrado] = useState<Veiculo | null>(null);
  const [localizacaoEncontrada, setLocalizacaoEncontrada] = useState<Localizacao | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string>('');
  const [manualInputVeiculo, setManualInputVeiculo] = useState('');
  const [manualInputLocalizacao, setManualInputLocalizacao] = useState({ armazem: '', rua: '', modulo: '', compartimento: '' });

  // Função para processar código escaneado
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
    } catch (e) {
      Alert.alert('Erro', 'QR Code com formato inválido.');
    }
  };

  // Buscar veículo por placa/chassi
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
    } catch (error) {
      setMensagem('Veículo não encontrado.');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar localização manual
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
    } catch (error) {
      setMensagem('Localização não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };

  // Processar QR Code manual (fallback)
  const processarQRCodeManual = (data: string) => {
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
    } catch (e) {
      Alert.alert('Erro', 'QR Code com formato inválido.');
    }
    
    setScanningType('none');
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
        setManualInputVeiculo('');
        setManualInputLocalizacao({ armazem: '', rua: '', modulo: '', compartimento: '' });
        setMensagem(''); 
      }, 5000); 
      
    } catch (error: any) {
      setMensagem(`Erro: ${error.message || 'Não foi possível guardar o registo.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Se estiver escaneando, mostrar o componente scanner REAL
  if (scanningType !== 'none' && Platform.OS !== 'web' && inputType === 'qr') {
    return (
      <BarcodeScanner 
        onBarcodeScanned={handleBarcodeScanned}
        onClose={() => setScanningType('none')}
      />
    );
  }

  // Tela de entrada manual para QR Code (fallback)
  if (scanningType !== 'none' && Platform.OS !== 'web' && inputType === 'manual') {
    return (
      <View style={styles.scannerContainer}>
        <Text style={styles.scannerTitle}>
          {scanningType === 'veiculo' ? 'DIGITAR CÓDIGO DO VEÍCULO' : 'DIGITAR CÓDIGO DO LOCAL'}
        </Text>
        
        <TextInput
          style={styles.scannerInput}
          placeholder="Cole aqui o conteúdo do QR Code (formato JSON)"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          onChangeText={(text) => {
            if (text.trim().length > 10) {
              processarQRCodeManual(text);
            }
          }}
        />
        
        <Text style={styles.scannerNote}>
          Exemplo veículo: {"{\"id\": 1, \"placa\": \"ABC1234\", \"chassi\": \"9BWZZZ377VT004251\"}"}
          {'\n'}
          Exemplo local: {"{\"id\": 1, \"armazem\": \"A1\", \"rua\": \"R1\", \"modulo\": \"M1\", \"compartimento\": \"C1\"}"}
        </Text>

        <TouchableOpacity 
          style={styles.alternativeButton} 
          onPress={() => setInputType('qr')}
        >
          <Text style={styles.alternativeButtonText}>TENTAR USAR CÂMERA NOVAMENTE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => setScanningType('none')}>
          <Text style={styles.cancelText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>RECEBIMENTO DE VEÍCULO</Text>

          {/* SEÇÃO VEÍCULO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {veiculoEncontrado ? `✓ VEÍCULO: ${veiculoEncontrado.placa}` : '1. IDENTIFICAR VEÍCULO'}
            </Text>
            
            {!veiculoEncontrado ? (
              <>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Placa, Chassi ou Contrato"
                    value={manualInputVeiculo}
                    onChangeText={setManualInputVeiculo}
                  />
                  <TouchableOpacity 
                    style={styles.searchButton}
                    onPress={buscarVeiculoManual}
                  >
                    <Text style={styles.searchButtonText}>BUSCAR</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.orText}>- OU -</Text>

                <TouchableOpacity 
                  style={styles.qrButton}
                  onPress={() => {
                    setInputType('qr');
                    setScanningType('veiculo');
                  }}
                >
                  <Text style={styles.qrButtonText}>📷 LER QR CODE DO VEÍCULO</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.manualQrButton}
                  onPress={() => {
                    setInputType('manual');
                    setScanningType('veiculo');
                  }}
                >
                  <Text style={styles.manualQrButtonText}>⌨️ DIGITAR QR CODE MANUALMENTE</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setVeiculoEncontrado(null)}
              >
                <Text style={styles.clearButtonText}>LIMPAR VEÍCULO</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* SEÇÃO LOCALIZAÇÃO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {localizacaoEncontrada ? `✓ LOCAL: ${localizacaoEncontrada.armazem}` : '2. IDENTIFICAR LOCALIZAÇÃO'}
            </Text>
            
            {!localizacaoEncontrada ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Armazém"
                  value={manualInputLocalizacao.armazem}
                  onChangeText={t => setManualInputLocalizacao(p => ({...p, armazem: t}))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Rua"
                  value={manualInputLocalizacao.rua}
                  onChangeText={t => setManualInputLocalizacao(p => ({...p, rua: t}))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Módulo"
                  value={manualInputLocalizacao.modulo}
                  onChangeText={t => setManualInputLocalizacao(p => ({...p, modulo: t}))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Compartimento"
                  value={manualInputLocalizacao.compartimento}
                  onChangeText={t => setManualInputLocalizacao(p => ({...p, compartimento: t}))}
                />

                <View style={styles.inputRow}>
                  <TouchableOpacity 
                    style={styles.searchButton}
                    onPress={buscarLocalizacaoManual}
                  >
                    <Text style={styles.searchButtonText}>BUSCAR LOCAL</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.orText}>- OU -</Text>

                <TouchableOpacity 
                  style={styles.qrButton}
                  onPress={() => {
                    setInputType('qr');
                    setScanningType('local');
                  }}
                >
                  <Text style={styles.qrButtonText}>📷 LER QR CODE DO LOCAL</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.manualQrButton}
                  onPress={() => {
                    setInputType('manual');
                    setScanningType('local');
                  }}
                >
                  <Text style={styles.manualQrButtonText}>⌨️ DIGITAR QR CODE MANUALMENTE</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setLocalizacaoEncontrada(null)}
              >
                <Text style={styles.clearButtonText}>LIMPAR LOCAL</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* MENSAGEM E LOADING */}
          {!!mensagem && <Text style={styles.message}>{mensagem}</Text>}
          {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 14 }} />}
          
          {/* BOTÃO ARMAZENAR */}
          {veiculoEncontrado && localizacaoEncontrada && !isLoading && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleArmazenar}>
              <Text style={styles.confirmButtonText}>✓ ARMAZENAR VEÍCULO</Text>
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
  section: {
    width: '100%',
    marginBottom: 25,
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
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
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
  },
  searchButtonText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  qrButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualQrButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  manualQrButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.error,
    alignItems: 'center',
  },
  clearButtonText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: theme.colors.text,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
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
  message: {
    color: theme.colors.text,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: theme.colors.border,
    fontSize: 12,
    width: '100%',
    marginTop: 20,
  },
  // Estilos para tela do QR Code manual
  scannerContainer: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
    padding: 20, 
    paddingTop: 50 
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  scannerInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    padding: 15,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  scannerNote: {
    color: theme.colors.text,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  alternativeButton: {
    backgroundColor: theme.colors.secondary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  alternativeButtonText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Recebimento;