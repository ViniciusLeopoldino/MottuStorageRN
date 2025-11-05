import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function TipoCadastro() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>TIPO DE REGISTO</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CadastroVeiculo')}
        >
          <Text style={styles.buttonText}>REGISTO DE VEÍCULO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CadastroLocalizacao')}
        >
          <Text style={styles.buttonText}>REGISTO DE LOCALIZAÇÃO</Text>
        </TouchableOpacity>
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
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
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
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    color: theme.colors.border,
    fontSize: 12,
    width: '100%',
  },
});
