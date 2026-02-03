import { useAuthSessionStore } from '@/store/authSessionStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/lib/queryClient';

function RootContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Safe Area Top - Barra BLANCA para barra de estado */}
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: '#FFFFFF' }} />
      )}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Splashscreen" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
        <Stack.Screen name="verifyAccounts" options={{ headerShown: false }} />
        <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }} />
      </Stack>
      {/* Safe Area Bottom - Barra oscura para botones del sistema */}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: '#1E1E1E' }} />
      )}
      {/* StatusBar con iconos oscuros para fondo blanco */}
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
    </View>
  );
}

function AppLoader({ children }: { children: any }) {
  const rehydrated = useAuthSessionStore((s) => s.rehydrated);
  const [ready, setReady] = useState(false);
  const [showInAppSplash, setShowInAppSplash] = useState(false);
  const splashFinishRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutHandle: number | null = null;

    async function prepare() {
      try {
        // Mantiene el splash nativo visible
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        // no crítico
      }

      // Esperar a que la rehidratación del store termine
      if (!rehydrated) {
        await new Promise<void>((resolve) => {
          const unsub = useAuthSessionStore.subscribe((s) => {
            if (s.rehydrated) { unsub(); resolve(); }
          });
        });
      }

      // Pequeño delay para evitar parpadeos
      await new Promise((r) => setTimeout(r, 200));

      // Ocultamos el splash nativo para mostrar la Splashscreen in-app
      try { await SplashScreen.hideAsync(); } catch (e) { }

      // Mostrar la Splashscreen in-app y esperar a que informe que terminó (con timeout)
      if (mounted) {
        setShowInAppSplash(true);

        await new Promise<void>((resolve) => {
          // resolver que Splashscreen llamará cuando llegue a 100%
          splashFinishRef.current = () => {
            splashFinishRef.current = null;
            resolve();
          };

          // Timeout de seguridad (10s)
          timeoutHandle = setTimeout(() => {
            if (splashFinishRef.current) {
              splashFinishRef.current = null;
              resolve();
            }
          }, 10000);
        });

        // Limpieza del timeout
        if (timeoutHandle) clearTimeout(timeoutHandle);

        setShowInAppSplash(false);
        setReady(true);
      }
    }

    prepare();
    return () => { mounted = false; if (timeoutHandle) clearTimeout(timeoutHandle); };
  }, [rehydrated]);

  // Mientras showInAppSplash es true mostramos el componente Splashscreen
  if (showInAppSplash) {
    // Importar dinámicamente el componente para evitar conflictos de nombres
    const AppSplash = require('./Splashscreen').default;
    return (
      <AppSplash
        onFinish={() => {
          if (splashFinishRef.current) {
            const fn = splashFinishRef.current;
            splashFinishRef.current = null;
            fn();
          }
        }}
      />
    );
  }

  if (!ready) return null; // fallback: nada
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppLoader>
          <RootContent />
        </AppLoader>
      </ThemeProvider>
    </QueryClientProvider>
  );
}