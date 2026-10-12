import { useTheme } from '@klozbuy/ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppFonts } from '../lib/fonts';
import { AppProviders } from '../lib/providers';

function ThemedStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bgCanvas },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;
  return (
    <AppProviders>
      <ThemedStack />
    </AppProviders>
  );
}
