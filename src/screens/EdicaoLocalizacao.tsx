import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface HistoricoItem {
  id: number;
  veiculo: { id: number; placa: string; };
  localizacao: { id: number; armazem: string; rua: string; modulo: string; compartimento: string; };
  dataRecebimento: string;
}

export default function EdicaoLocalizacao() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const { historicoItem } = route.params as { historicoItem: HistoricoItem };

  const [novaLocalizacao, setNovaLocalizacao] = useState({
    armazem: '',
    rua: '',
    modulo: '',
    compartimento: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (historicoItem) {
      setNovaLocalizacao({
        armazem: historicoItem.localizacao.armazem,
        rua: historicoItem.localizacao.rua,
        modulo: historicoItem.localizacao.modulo,
        compartimento: historicoItem.localizacao.compartimento
      });
    }
  }, [historicoItem]);

  const handleSalvar = async () => {
    setIsLoading(true);
    try {
      await api.updateHistoryLocation(historicoItem.id, novaLocalizacao);
    setNovaLocalizacao({
        armazem: '',
        rua: '',
        modulo: '',
        compartimento: ''
      });
      Alert.alert('Sucesso', 'Localização atualizada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a localização.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>EDITAR LOCALIZAÇÃO</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Veículo</Text>
          <Text style={styles.text}>{historicoItem.veiculo.placa}</Text>
          <Text style={styles.label}>Localização Atual</Text>
          <Text style={styles.text}>{`${historicoItem.localizacao.armazem}-${historicoItem.localizacao.rua}-${historicoItem.localizacao.modulo}-${historicoItem.localizacao.compartimento}`}</Text>
        </View>

        <Text style={styles.label}>Nova Localização</Text>
        <TextInput
          style={styles.input}
          placeholder="Armazém"
          value={novaLocalizacao.armazem}
          onChangeText={t => setNovaLocalizacao(p => ({ ...p, armazem: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={novaLocalizacao.rua}
          onChangeText={t => setNovaLocalizacao(p => ({ ...p, rua: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Módulo"
          value={novaLocalizacao.modulo}
          onChangeText={t => setNovaLocalizacao(p => ({ ...p, modulo: t }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Compartimento"
          value={novaLocalizacao.compartimento}
          onChangeText={t => setNovaLocalizacao(p => ({ ...p, compartimento: t }))}
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={theme.colors.background} /> : <Text style={styles.buttonText}>SALVAR ALTERAÇÕES</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>CANCELAR</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: theme.colors.background, padding: 20 },
  title: { color: theme.colors.primary, fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: theme.colors.card, borderRadius: 8, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
  label: { color: theme.colors.primary, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  text: { color: theme.colors.text, marginBottom: 10 },
  input: { width: '100%', borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 20, color: theme.colors.text, fontSize: 16, marginBottom: 10 },
  button: { backgroundColor: theme.colors.primary, paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 20, width: '100%' },
  buttonText: { color: theme.colors.background, fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 10, padding: 12, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center', width: '100%' },
  backButtonText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: 16 },
});