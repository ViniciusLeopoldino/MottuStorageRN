import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  projectId: 'mottustorage',
  appId: '1:98352426051:android:ef89c06fc3a4a10ce5f8f6',
  apiKey: 'AIzaSyBR1z2TaMAq1hzwSfVxTh7tLfTL52dbpQg',
  storageBucket: 'mottustorage.firebasestorage.app',
  // Adicionar campos opcionais para evitar erros
  databaseURL: 'https://mottustorage.firebaseio.com',
  messagingSenderId: '98352426051'
};

try {
  const app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.log('Firebase initialization error:', error);
}

export default firebaseConfig;