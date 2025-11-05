import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'erro' | 'sucesso' | ''>('');

  const handleRegister = async () => {
    setMensagem('');
    setTipoMensagem('');

    if (!username || !email || !password || !confirmPassword) {
      setMensagem('Preencha todos os campos.');
      setTipoMensagem('erro');
      return;
    }
    if (password !== confirmPassword) {
      setMensagem('As senhas não coincidem.');
      setTipoMensagem('erro');
      return;
    }
    if (password.length < 6) {
      setMensagem('A senha deve ter pelo menos 6 caracteres.');
      setTipoMensagem('erro');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMensagem('Email inválido.');
      setTipoMensagem('erro');
      return;
    }

    setIsLoading(true);

    try {
      await api.register({
        nome: username,
        email: email,
        senha: password
      });
      
      setMensagem('Utilizador registrado com sucesso!');
      setTipoMensagem('sucesso');
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      setMensagem(error.message || 'Erro ao registrar utilizador.');
      setTipoMensagem('erro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de Utilizador"
        placeholderTextColor={theme.colors.primary}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.primary}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={theme.colors.primary}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor={theme.colors.primary}
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
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

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
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
