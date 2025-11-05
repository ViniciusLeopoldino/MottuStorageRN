import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPassword() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | ''>('');

  const handleRecovery = () => {
    if (!email) {
      setMensagem('Preencha o campo de email.');
      setTipoMensagem('erro');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMensagem('Email inválido.');
      setTipoMensagem('erro');
      return;
    }

    setMensagem('Siga os passos enviados para o seu email.');
    setTipoMensagem('sucesso');

    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.primary}
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      {mensagem !== '' && (
        <Text
          style={[
            styles.mensagem,
            tipoMensagem === 'erro' ? styles.erro : styles.sucesso,
          ]}
        >
          {mensagem}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleRecovery}>
        <Text style={styles.buttonText}>Recuperar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 25,
    color: theme.colors.text,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: theme.colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  mensagem: {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 14,
  },
  erro: {
    color: theme.colors.error,
  },
  sucesso: {
    color: theme.colors.primary,
  },
});
