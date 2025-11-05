import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onBarcodeScanned, onClose }: BarcodeScannerProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [manualCode, setManualCode] = useState('');

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert('Aviso', 'Digite ou cole o código QR');
      return;
    }

    if (manualCode.trim().length < 10) {
      Alert.alert('Aviso', 'O código parece muito curto. Verifique se está completo.');
      return;
    }

    onBarcodeScanned(manualCode);
    setManualCode('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEITOR DE QR CODE</Text>
      <Text style={styles.subtitle}>Modo Manual</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Cole ou digite o código QR aqui..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        value={manualCode}
        onChangeText={setManualCode}
      />
      
      <Text style={styles.instruction}>
        📱 Como obter o código QR:{'\n'}
        1. Abra o QR Code em outro dispositivo{'\n'}
        2. Use um app leitor de QR Code{'\n'}
        3. Copie o texto resultante{'\n'}
        4. Cole acima
      </Text>

      <Text style={styles.example}>
        Exemplo de formato esperado:{'\n'}
        {"{\"id\": 1, \"placa\": \"ABC1234\", \"chassi\": \"...\"}"}
        {'\n'}
        {"{\"id\": 1, \"armazem\": \"A1\", \"rua\": \"R1\", ...}"}
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
        <Text style={styles.submitButtonText}>PROCESSAR CÓDIGO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    padding: 15,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 150,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.card,
  },
  instruction: {
    color: theme.colors.text,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: 10,
  },
  example: {
    color: theme.colors.border,
    fontSize: 12,
    marginBottom: 30,
    lineHeight: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});