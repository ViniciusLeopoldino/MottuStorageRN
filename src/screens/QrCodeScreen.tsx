import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Image,
  Linking
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function QrCodeScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { data, veiculo } = route.params as { 
    data: string; 
    veiculo: any 
  };

  // Gerar URL do QR Code usando API online
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;

  const handleShare = async () => {
    try {
      const message = `Veículo: ${veiculo.placa}\nChassi: ${veiculo.chassi}\nModelo: ${veiculo.modelo}\n\nQR Code: ${qrCodeUrl}`;
      
      await Share.share({
        message: message,
        title: `QR Code Veículo ${veiculo.placa}`
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar');
    }
  };

  const handleOpenQrCode = () => {
    Linking.openURL(qrCodeUrl).catch(err => 
      Alert.alert('Erro', 'Não foi possível abrir o QR Code')
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR CODE DO VEÍCULO</Text>
      
      <View style={styles.qrContainer}>
        <Image 
          source={{ uri: qrCodeUrl }}
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.note}>Toque na imagem para abrir em tela cheia</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Placa: {veiculo.placa}</Text>
        <Text style={styles.infoText}>Chassi: {veiculo.chassi}</Text>
        <Text style={styles.infoText}>Modelo: {veiculo.modelo}</Text>
      </View>

      <TouchableOpacity style={styles.qrButton} onPress={handleOpenQrCode}>
        <Text style={styles.qrButtonText}>ABRIR QR CODE EM TELA CHEIA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>COMPARTILHAR DADOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>VOLTAR</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Desenvolvido por DPV-Tech</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  note: {
    color: theme.colors.text,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  qrButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  qrButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  shareButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: theme.colors.border,
    fontSize: 12,
    marginTop: 'auto',
  },
});