import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { useEffect, useState } from 'react';
import { NotificationWillDisplayEvent, OneSignal, OSNotification } from 'react-native-onesignal';
import { Notification } from '../components/Notification';

const linking = {
  prefixes: ['com.igniteshoes://', 'igniteshoes://'],
  config: {
    screens: {
      details: {
        path: 'details/:productId',
        parse: {
          productId: (productId: string) => productId
        }
      }
    }
  }
}

export function Routes() {
  const [notification, setNotification] = useState<OSNotification>()

  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  useEffect(() => {
    const handleNotification = (event: NotificationWillDisplayEvent) => {
      event.preventDefault()
      const response = event.getNotification()
      setNotification(response)
    };

    OneSignal.Notifications.addEventListener('foregroundWillDisplay', handleNotification)

    return () => {
      OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handleNotification)
    }
  }, [])

  return (
    <NavigationContainer theme={theme} linking={linking}>
      <AppRoutes />

      {notification && (
        <Notification
          data={notification}
          onClose={() => setNotification(undefined)}
        />
      )}
    </NavigationContainer>
  );
}