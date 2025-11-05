import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface HistoricoItem {
  id: number;
  veiculo: {
    id: number;
    placa: string;
  };
  localizacao: {
    id: number;
    armazem: string;
    rua: string;
    modulo: string;
    compartimento: string;
  };
  dataRecebimento: string;
}

export default function Historico() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();

  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const carregarHistorico = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await api.getHistory();
      setHistorico(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      if (showLoading) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregarHistorico(); }, [carregarHistorico]));

  const onRefresh = () => {
    setIsRefreshing(true);
    carregarHistorico(false);
  };

  const handleExcluir = (item: HistoricoItem) => {
    const executarAcao = async (acao: 'recebimento' | 'veiculo' | 'localizacao') => {
      try {
        let mensagemSucesso = '';
        if (acao === 'recebimento') {
          await api.deleteHistoryItem(item.id);
          mensagemSucesso = 'Registo de recebimento apagado.';
        } else if (acao === 'veiculo') {
          await api.deleteVehicle(item.veiculo.id);
          mensagemSucesso = 'Veículo e todo o seu histórico foram apagados.';
        } else if (acao === 'localizacao') {
          await api.deleteLocation(item.localizacao.id);
          mensagemSucesso = 'Localização e todo o seu histórico foram apagados.';
        }
        Alert.alert('Sucesso', mensagemSucesso);
        carregarHistorico(false);
      } catch (err) {
        Alert.alert('Erro', `Não foi possível apagar o/a ${acao}.`);
      }
    };

    if (Platform.OS === 'web') {
      const querApagarRecebimento = window.confirm(`Deseja apagar APENAS o recebimento do veículo ${item.veiculo.placa}?`);
      if (querApagarRecebimento) {
        executarAcao('recebimento');
        return;
      }
      const querApagarVeiculo = window.confirm(`Deseja apagar o VEÍCULO ${item.veiculo.placa} e todo o seu histórico?`);
      if (querApagarVeiculo) {
        executarAcao('veiculo');
        return;
      }
      const querApagarLocalizacao = window.confirm(`Deseja apagar a LOCALIZAÇÃO e todo o seu histórico?`);
      if (querApagarLocalizacao) {
        executarAcao('localizacao');
      }
    } else {
      Alert.alert(
        'Escolha uma Opção de Exclusão',
        `O que deseja apagar relacionado ao veículo ${item.veiculo.placa}?`,
        [
          { text: '1. Apenas este Recebimento', onPress: () => executarAcao('recebimento') },
          { text: '2. Excluir Veículo (e todo o seu histórico)', style: 'destructive', onPress: () => executarAcao('veiculo') },
          { text: '3. Excluir Localização (e todo o seu histórico)', style: 'destructive', onPress: () => executarAcao('localizacao') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    }
  };

  const handleEditar = (item: HistoricoItem) => {
    navigation.navigate('EdicaoLocalizacao', { historicoItem: item });
  };

  const limparHistorico = () => {
    const executarLimpeza = async () => {
      try {
        await api.clearHistory();
        setHistorico([]);
        Alert.alert('Sucesso', 'Histórico apagado com sucesso!');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível apagar o histórico.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Deseja apagar TODO o histórico? Esta ação não pode ser desfeita.')) {
        executarLimpeza();
      }
    } else {
      Alert.alert('Confirmação', 'Deseja apagar TODO o histórico? Esta ação não pode ser desfeita.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar Tudo', style: 'destructive', onPress: executarLimpeza },
      ]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>HISTÓRICO DE RECEBIMENTOS</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        >
          {historico.length === 0 ? (
            <Text style={styles.empty}>Nenhum recebimento armazenado ainda.</Text>
          ) : (
            historico.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.textBold}>Veículo: {item.veiculo.placa}</Text>
                <Text style={styles.text}>
                  Local: {`${item.localizacao.armazem}-${item.localizacao.rua}-${item.localizacao.modulo}-${item.localizacao.compartimento}`}
                </Text>
                <Text style={styles.text}>
                  Data: {new Date(item.dataRecebimento).toLocaleString('pt-BR')}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditar(item)}
                  >
                    <Text style={styles.actionText}>EDITAR LOCALIZAÇÃO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleExcluir(item)}
                  >
                    <Text style={styles.actionText}>EXCLUIR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
        {historico.length > 0 && !isLoading && (
          <TouchableOpacity style={styles.clearButton} onPress={limparHistorico}>
            <Text style={styles.clearButtonText}>LIMPAR HISTÓRICO</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  container: { paddingBottom: 20 },
  title: { color: theme.colors.primary, fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  empty: { color: theme.colors.border, textAlign: 'center', marginTop: 50 },
  item: { backgroundColor: theme.colors.card, borderRadius: 8, padding: 15, marginBottom: 15, borderColor: theme.colors.border, borderWidth: 1 },
  text: { color: theme.colors.text, opacity: 0.8, marginBottom: 4 },
  textBold: { color: theme.colors.text, fontWeight: 'bold', marginBottom: 4, fontSize: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginHorizontal: 5 },
  actionText: { color: theme.colors.background, fontWeight: 'bold', fontSize: 12 },
  editButton: { backgroundColor: theme.colors.primary },
  deleteButton: { backgroundColor: theme.colors.error },
  footerButtons: { marginTop: 10 },
  clearButton: { backgroundColor: theme.colors.error, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  clearButtonText: { color: theme.colors.background, fontWeight: 'bold', fontSize: 16 },
  backButton: { padding: 12, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center' },
  backButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
  footer: { color: theme.colors.border, textAlign: 'center', fontSize: 12, paddingTop: 20 },
});