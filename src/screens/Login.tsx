import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { sendTestNotification } from '../services/notifications';

export default function Login({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginContext } = useAuth();

  const handleLogin = async () => {
    setMensagemErro('');
    if (!email || !senha) {
      setMensagemErro('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login(email, senha);
      if (response && response.user) {
        //  ADICIONAR NOTIFICAÇÃO AQUI - LOGIN BEM-SUCEDIDO
        await sendTestNotification();
        
        //console.log('Response user:', JSON.stringify(response.user, null, 2));
        await loginContext(response.user);
      } else {
        setMensagemErro('Resposta inválida do servidor.');
      }
    } catch (error: any) {
      setMensagemErro(error.message || 'Não foi possível conectar ao servidor.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Login (Email)"
        placeholderTextColor={theme.colors.primary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={theme.colors.primary}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      {mensagemErro !== '' && (
        <Text style={styles.mensagemErro}>{mensagemErro}</Text>
      )}
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 14, marginBottom: 25 }} />
      ) : (
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')} disabled={isLoading}>
        <Text style={styles.link}>Recuperar Senha</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastrar')} disabled={isLoading}>
        <Text style={styles.link}>Cadastrar</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
    </View>
  );
}

const getStyles = (theme: typeof theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    color: theme.colors.text,
    marginBottom: 15,
    fontSize: 16,
  },
  mensagemErro: {
    color: theme.colors.error,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: theme.colors.primary,
    marginVertical: 5,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: theme.colors.border,
    fontSize: 12,
  },
});