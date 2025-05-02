import { Platform, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Routes } from './src/routes';

import { THEME } from './src/theme';
import { Loading } from './src/components/Loading';

import { CartContextProvider } from './src/contexts/CartContext';
import { NotificationClickEvent, OneSignal } from 'react-native-onesignal';
import { useEffect } from 'react';

const OneSignalID = Platform.OS === 'ios' ? 'b577f839-a848-4486-9b67-532325c02eaf' : "68ab0c00-46dd-4669-a3b6-c960f2872467"

OneSignal.initialize(OneSignalID)
OneSignal.Notifications.requestPermission(true)

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  useEffect(() => {
    const handleNotificationClick = (event: NotificationClickEvent) => {
      const { actionId } = event.result

      switch (actionId) {
        case '1':
          console.log('Ver mais detalhes do produto')
          break;
        case '2':
          console.log('Ver carrinho')
          break;
        default:
          console.log('Nenhuma ação encontrada')
          break;
      }
    }

    OneSignal.Notifications.addEventListener('click', handleNotificationClick)

    return () => {
      OneSignal.Notifications.removeEventListener('click', handleNotificationClick)
    }
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <CartContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </CartContextProvider>
    </NativeBaseProvider>
  );
}