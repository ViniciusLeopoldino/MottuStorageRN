import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function CadastroLocalizacao() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [localizacao, setLocalizacao] = React.useState({
    armazem: '',
    rua: '',
    modulo: '',
    compartimento: '',
  });
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [mensagem, setMensagem] = React.useState('');
  const [tipoMensagem, setTipoMensagem] = React.useState<'erro' | 'sucesso' | ''>('');

  const limparCampos = () => {
    setLocalizacao({ armazem: '', rua: '', modulo: '', compartimento: '' });
    setMensagem('');
    setTipoMensagem('');
  };

  const reutilizarLocalizacao = async () => {
    try {
      const salvo = await AsyncStorage.getItem('ultimaLocalizacao');
      if (salvo) {
        setLocalizacao(JSON.parse(salvo));
        Alert.alert('Sucesso', 'Última localização carregada!');
      } else {
        Alert.alert('Aviso', 'Nenhuma localização anterior encontrada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a localização.');
    }
  };

  const salvarLocalizacao = async () => {
    setMensagem('');
    setTipoMensagem('');

    if (!localizacao.armazem || !localizacao.rua || !localizacao.modulo || !localizacao.compartimento) {
      setMensagem('Todos os campos são obrigatórios.');
      setTipoMensagem('erro');
      return;
    }

    setIsLoading(true);

    try {
      await api.createLocation(localizacao);
      await AsyncStorage.setItem('ultimaLocalizacao', JSON.stringify(localizacao));
      const nome_localizacao = `${localizacao.armazem}-${localizacao.rua}-${localizacao.modulo}-${localizacao.compartimento}`;
      setMensagem(`Localização guardada com sucesso: ${nome_localizacao}`);
      setTipoMensagem('sucesso');
    } catch (err: any) {
      setMensagem(err.message || 'Erro ao guardar a localização.');
      setTipoMensagem('erro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Registo de Localização</Text>
        {(Object.keys(localizacao) as Array<keyof typeof localizacao>).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={key.toUpperCase()}
            placeholderTextColor={theme.colors.border}
            value={localizacao[key]}
            onChangeText={(text) => setLocalizacao((prev) => ({ ...prev, [key]: text.toUpperCase() }))}
            autoCapitalize="characters"
          />
        ))}
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={reutilizarLocalizacao}>
            <Text style={styles.linkText}>Reutilizar última localização</Text>
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
          <TouchableOpacity style={styles.button} onPress={salvarLocalizacao}>
            <Text style={styles.buttonText}>GUARDAR</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
      <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'space-between' },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 30 },
  input: { width: '100%', borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20, color: theme.colors.text, fontSize: 16, marginBottom: 15 },
  linkContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, marginBottom: 20 },
  linkText: { color: theme.colors.primary, textDecorationLine: 'underline', fontSize: 14, fontWeight: '500' },
  button: { backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  buttonText: { color: theme.colors.background, fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 15, padding: 12, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center' },
  backButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  footer: { textAlign: 'center', color: theme.colors.border, fontSize: 12, paddingVertical: 10 },
  message: { textAlign: 'center', marginBottom: 15, fontWeight: 'bold', fontSize: 14 },
  erro: { color: theme.colors.error },
  sucesso: { color: theme.colors.primary },
});
