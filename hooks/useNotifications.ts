import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null,
  });
}

export function useNotificationSetup() {
  const configured = useRef(false);

  useEffect(() => {
    if (configured.current) return;
    configured.current = true;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);
}

export const notifications = {
  newRequest: (name: string) =>
    scheduleLocalNotification(
      'New run request',
      `${name} wants to join your run.`,
    ),
  requestAccepted: (name: string) =>
    scheduleLocalNotification(
      'Request accepted',
      `${name} accepted your request. Chat is now open.`,
    ),
  requestDeclined: () =>
    scheduleLocalNotification(
      'Request declined',
      'Your run request was declined. Keep exploring.',
    ),
  requestExpiring: (name: string) =>
    scheduleLocalNotification(
      'Request expiring soon',
      `Your request to join ${name}'s run expires in 2 hours.`,
    ),
};
