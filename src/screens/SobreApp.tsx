import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import { useTheme } from "../context/ThemeContext";

// O commit hash será injetado durante o build
const COMMIT_HASH = process.env.COMMIT_HASH || "d710f00";

export default function SobreApp({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleOpenGitHub = () => {
    Linking.openURL("https://github.com/ViniciusLeopoldino/MottuStorageRN");
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      
      <Text style={styles.title}>Sobre o App</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>MottuStorage</Text>
        
        <Text style={styles.label}>Versão:</Text>
        <Text style={styles.value}>1.0.0</Text>
        
        <Text style={styles.label}>Commit:</Text>
        <Text style={styles.value}>{COMMIT_HASH}</Text>
        
        <Text style={styles.label}>Desenvolvido por:</Text>
        <Text style={styles.value}>DPV-Tech</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleOpenGitHub}>
        <Text style={styles.buttonText}>VER NO GITHUB</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>VOLTAR</Text>
      </TouchableOpacity>

      <Text style={styles.footer}> 2024 DPV-Tech - Todos os direitos reservados</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
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
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
    backButton: {
    marginTop: 20,
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
    bottom: 20,
    color: theme.colors.border,
    fontSize: 12,
    textAlign: 'center',
  },
});
