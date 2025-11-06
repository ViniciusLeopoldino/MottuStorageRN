import './src/config/firebase';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/screens/Login';
import Home from './src/screens/Home';
import CadastroVeiculo from './src/screens/CadastroVeiculos';
import CadastroLocalizacao from './src/screens/CadastroLocalizacao';
import Recebimento from './src/screens/Recebimento';
import Consulta from './src/screens/Consulta';
import TipoCadastro from './src/screens/TipoCadastro';
import Cadastrar from './src/screens/Cadastrar';
import RecuperarSenha from './src/screens/RecuperarSenha';
import Historico from './src/screens/Historico';
import EdicaoLocalizacao from './src/screens/EdicaoLocalizacao';
import SobreApp from './src/screens/SobreApp';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import QrCodeScreen from './src/screens/QrCodeScreen';
import LocalizacaoQrCodeScreen from './src/screens/LocalizacaoQrCodeScreen';

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!usuario ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastrar" component={Cadastrar} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TipoCadastro" component={TipoCadastro} />
          <Stack.Screen name="CadastroVeiculo" component={CadastroVeiculo} />
          <Stack.Screen name="CadastroLocalizacao" component={CadastroLocalizacao} />
          <Stack.Screen name="QrCodeScreen" component={QrCodeScreen} />
          <Stack.Screen name="LocalizacaoQrCodeScreen" component={LocalizacaoQrCodeScreen} />
          <Stack.Screen name="Recebimento" component={Recebimento} />
          <Stack.Screen name="Consulta" component={Consulta} />
          <Stack.Screen name="Historico" component={Historico} />
          <Stack.Screen name="EdicaoLocalizacao" component={EdicaoLocalizacao} />
          <Stack.Screen name="SobreApp" component={SobreApp} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
