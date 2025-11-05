import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function CadastroVeiculo() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [veiculo, setVeiculo] = useState({
    placa: '',
    chassi: '',
    modelo: '',
    km: '',
    contrato: '',
    ocorrencia: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | ''>('');

  const limparCampos = () => {
    setVeiculo({ placa: '', chassi: '', modelo: '', km: '', contrato: '', ocorrencia: '' });
    setMensagem('');
    setTipoMensagem('');
  };

  const reutilizarCadastro = async () => {
    try {
      const salvo = await AsyncStorage.getItem('ultimoCadastroLocal');
      if (salvo) {
        setVeiculo(JSON.parse(salvo));
        Alert.alert('Sucesso', 'Último registo local carregado!');
      } else {
        Alert.alert('Aviso', 'Nenhum registo anterior encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o registo.');
    }
  };

  const handleSaveAndPrint = async () => {
    setMensagem('');
    setTipoMensagem('');

    if (!veiculo.placa || !veiculo.chassi) {
      setMensagem('Placa e Chassi são obrigatórios.');
      setTipoMensagem('erro');
      return;
    }

    setIsLoading(true);

    try {
      const veiculoSalvo = await api.createVehicle(veiculo);
      await AsyncStorage.setItem('ultimoCadastroLocal', JSON.stringify(veiculo));
      setMensagem('Veículo registado com sucesso! A gerar QR Code...');
      setTipoMensagem('sucesso');

      const dataString = JSON.stringify(veiculoSalvo);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(dataString)}&size=300x300`;

      if (Platform.OS === 'web') {
        window.open(qrUrl, '_blank');
      } else {
        const filename = FileSystem.documentDirectory + 'dpvtech-qr.png';
        const { uri } = await FileSystem.downloadAsync(qrUrl, filename);
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('Download', asset, false);
          Alert.alert('Sucesso', 'QR Code guardado na sua galeria!');
        } else {
          Alert.alert('Erro', 'Permissão negada para guardar imagens.');
        }
      }
    } catch (error: any) {
      setMensagem(error.message || 'Falha ao registar o veículo.');
      setTipoMensagem('erro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registo de Veículos</Text>
        <View style={styles.form}>
          {(['placa', 'chassi', 'modelo', 'km', 'contrato', 'ocorrencia'] as const).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.toUpperCase()}
              placeholderTextColor={theme.colors.border}
              value={veiculo[key]}
              onChangeText={(text) => setVeiculo((v) => ({ ...v, [key]: text }))}
              keyboardType={key === 'km' ? 'numeric' : 'default'}
            />
          ))}
          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={reutilizarCadastro}>
              <Text style={styles.linkText}>Reutilizar último registo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={limparCampos}>
              <Text style={styles.linkText}>Limpar Campos</Text>
            </TouchableOpacity>
          </View>

          {mensagem !== '' && (
            <Text style={[styles.message, tipoMensagem === 'erro' ? styles.erro : styles.sucesso]}>
              {mensagem}
            </Text>
          )}

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSaveAndPrint}>
              <Text style={styles.buttonText}>GUARDAR E IMPRIMIR QR CODE</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: 20 },
  form: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20, color: theme.colors.text, fontSize: 16, marginBottom: 15 },
  linkContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, marginBottom: 20 },
  linkText: { color: theme.colors.primary, textDecorationLine: 'underline', fontSize: 14, fontWeight: '500' },
  button: { backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, width: '100%' },
  buttonText: { color: theme.colors.background, fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 15, padding: 12, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center', width: '100%' },
  backButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  footer: { textAlign: 'center', color: theme.colors.border, fontSize: 12, paddingVertical: 10 },
  message: { textAlign: 'center', marginBottom: 15, fontWeight: 'bold', fontSize: 14 },
  erro: { color: theme.colors.error },
  sucesso: { color: theme.colors.primary },
});
