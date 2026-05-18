import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RequestProvider } from '../context/RequestContext';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <RequestProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="brew" options={{ title: 'Brew a cup' }} />
        <Stack.Screen name="troubleshoot" options={{ title: 'Troubleshoot' }} />
        <Stack.Screen name="result" options={{ title: '' }} />
      </Stack>
    </RequestProvider>
  );
}
