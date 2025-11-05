import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface Veiculo {
  id: number;
  placa: string;
  chassi: string;
  modelo: string;
  km: number;
  contrato: string;
  ocorrencia: string;
}
interface Localizacao {
  id: number;
  armazem: string;
  rua: string;
  modulo: string;
  compartimento: string;
}
interface ResultadoBusca {
  veiculo: Veiculo;
  localizacao?: Localizacao;
}

export default function Consulta() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [resultado, setResultado] = useState<ResultadoBusca | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleConsultar = async () => {
    Keyboard.dismiss();
    setMensagem('');
    setResultado(null);

    if (!query) {
      setMensagem('Por favor, insira um termo para a busca.');
      return;
    }

    setIsLoading(true);

    try {
      const apiResult = await api.searchVehicle(query);
      setResultado(apiResult);
    } catch (error: any) {
      setResultado(null);
      setMensagem('Veículo não encontrado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>CONSULTA DE VEÍCULO</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira PLACA, CHASSI ou CONTRATO"
          placeholderTextColor={theme.colors.primary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="characters"
        />
        
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleConsultar}>
            <Text style={styles.buttonText}>CONSULTAR</Text>
          </TouchableOpacity>
        )}

        {mensagem && !resultado && (
          <Text style={styles.mensagemErro}>{mensagem}</Text>
        )}

        {resultado && (
          <View style={styles.resultado}>
            <Text style={styles.resultadoTitulo}>Dados do Veículo:</Text>
            <Text style={styles.resultadoTexto}>PLACA: {resultado.veiculo.placa}</Text>
            <Text style={styles.resultadoTexto}>CHASSI: {resultado.veiculo.chassi}</Text>
            <Text style={styles.resultadoTexto}>MODELO: {resultado.veiculo.modelo}</Text>
            {resultado.localizacao && (
              <>
                <Text style={styles.resultadoTitulo}>Última Localização:</Text>
                <Text style={styles.resultadoTexto}>
                  {`${resultado.localizacao.armazem}-${resultado.localizacao.rua}-${resultado.localizacao.modulo}-${resultado.localizacao.compartimento}`}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>VOLTAR</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  container: { width: '100%', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20, color: theme.colors.text, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, width: '100%' },
  buttonText: { color: theme.colors.background, fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 15, padding: 12, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center', width: '100%' },
  backButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  resultado: { width: '100%', marginTop: 20, padding: 20, backgroundColor: theme.colors.card, borderRadius: 10, borderColor: theme.colors.primary, borderWidth: 1 },
  resultadoTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: theme.colors.primary, marginTop: 10 },
  resultadoTexto: { marginBottom: 5, color: theme.colors.text, fontSize: 14 },
  mensagemErro: { marginTop: 20, color: theme.colors.error, fontWeight: 'bold', textAlign: 'center' },
  footer: { position: 'absolute', bottom: 10, textAlign: 'center', color: theme.colors.border, fontSize: 12, width: '100%' },
});
