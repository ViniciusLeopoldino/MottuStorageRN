import React, { createContext, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const carregarLogin = async () => {
      try {
        const userSalvo = await AsyncStorage.getItem('usuarioLogado');
        if (userSalvo) {
          setUsuario(JSON.parse(userSalvo));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };
    carregarLogin();
  }, []);

  const login = async (usuario: Usuario) => {
    try {
      await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      setUsuario(usuario);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      setUsuario(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);