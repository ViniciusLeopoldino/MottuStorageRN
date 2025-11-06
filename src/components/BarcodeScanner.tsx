import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { useTheme } from '../context/ThemeContext';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onBarcodeScanned, onClose }: BarcodeScannerProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [scanned, setScanned] = useState(false);

  const onReadCode = (event: any) => {
    if (!scanned && event.nativeEvent.codeStringValue) {
      Vibration.vibrate(200);
      setScanned(true);
      console.log('QR Code lido:', event.nativeEvent.codeStringValue);
      onBarcodeScanned(event.nativeEvent.codeStringValue);
      
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        cameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={onReadCode}
        showFrame={true}
        laserColor={theme.colors.primary}
        frameColor={theme.colors.primary}
      />
      
      <View style={styles.overlay}>
        <Text style={styles.instruction}>Aponte para o QR Code</Text>
        {scanned && <Text style={styles.scannedText}>✓ Código lido!</Text>}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕ FECHAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  instruction: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
  scannedText: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});