import messaging from '@react-native-firebase/messaging';

// Solicitar permissão para notificações
export const requestPermissions = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    
    return enabled;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Obter token do dispositivo
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Enviar notificação local (para teste)
export const sendTestNotification = async () => {
  try {
    const hasPermission = await requestPermissions();
    
    if (hasPermission) {
      // Para notificações locais, você pode usar:
      // await messaging().displayNotification({ ... });
      // Ou enviar via sua API backend
      
      console.log('Notificação de teste - Permissão concedida');
      return true;
    }
    
    console.log('Notificação de teste - Permissão negada');
    return false;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

// Configurar listeners para notificações em primeiro e segundo plano
export const setupNotificationListeners = () => {
  // Notificação recebida com app em foreground
  messaging().onMessage(async remoteMessage => {
    console.log('Notificação em foreground:', remoteMessage);
  });

  // Notificação recebida com app em background
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Notificação em background:', remoteMessage);
  });
};