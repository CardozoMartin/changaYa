import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useAuthSessionStore } from "@/store/authSessionStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Tabs, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/queryClient";

function RootContent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const schemeKey = (colorScheme ?? "light") as "light" | "dark";
  const router = useRouter();
  const token = useAuthSessionStore((s) => s.token);
  const rehydrated = useAuthSessionStore((s) => s.rehydrated);

  // Si la store ya se rehidrató y no hay token, forzamos ir a auth
  // Esto evita que la app muestre las tabs cuando no hay sesión activa
  useEffect(() => {
    if (rehydrated && !token) {
      router.replace("/auth/LoginScreen");
    }
  }, [rehydrated, token, router]);

  return (
    <View style={{ flex: 1 }}>
      {/* Safe Area Top - Barra BLANCA para barra de estado */}
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <Tabs
        tabBar={(props: any) => {
          // map current route to our menu's activeTab key
          const routeName = props.state?.routes?.[props.state.index]?.name;

          // Ocultar el BottomMenu en pantallas donde no queremos el menú inferior
          const hiddenScreens = [
            "CompleteProfileScreen",
            "OnboardingScreen",
            "TermsAndPrivacyScreen",
          ];
          if (hiddenScreens.includes(routeName)) {
            return null;
          }

          const mapToKey = (name: string) => {
            if (name === "HomeScreen") return "home";
            if (name === "OpportunitiesScreen") return "search";
            if (name === "MisChangasPublicadasScreen") return "search";
            if (name === "ProfileScreen") return "profile";
            if (name === "MisPostulacionesScreen") return "messages";
            return "home";
          };

          // Handler for tab presses - with toggle logic for search tab
          const handlePress = (
            key: "home" | "search" | "create" | "messages" | "profile",
          ) => {
            if (key === "home") props.navigation.navigate("HomeScreen");
            else if (key === "search") {
              // Toggle between OpportunitiesScreen and MisChangasPublicadasScreen
              const currentRoute =
                props.state?.routes?.[props.state.index]?.name;
              if (currentRoute === "MisChangasPublicadasScreen") {
                props.navigation.navigate("OpportunitiesScreen");
              } else {
                props.navigation.navigate("MisChangasPublicadasScreen");
              }
            } else if (key === "profile")
              props.navigation.navigate("ProfileScreen");
            else if (key === "create")
              props.navigation.navigate("PublishJobScreen");
            else if (key === "messages")
              props.navigation.navigate("MisPostulacionesScreen");
          };

          const BottomMenu = require("./menu").default;
          return (
            <BottomMenu
              activeTab={mapToKey(routeName)}
              onTabPress={handlePress}
            />
          );
        }}
        screenOptions={{
          tabBarActiveTintColor: Colors[schemeKey].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="HomeScreen"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="OpportunitiesScreen"
          options={{
            title: "Explore",
          }}
        />
        <Tabs.Screen
          name="ProfileScreen"
          options={{
            title: "Perfil",
          }}
        />
        <Tabs.Screen
          name="MisChangasPublicadasScreen"
          options={{
            title: "MisChangas",
          }}
        />
        <Tabs.Screen
          name="MisPostulacionesScreen"
          options={{
            title: "Postulaciones",
          }}
        />
      </Tabs>
      {/* Safe Area Bottom - Barra oscura para botones del sistema */}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#1E1E1E" }} />
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
            if (s.rehydrated) {
              unsub();
              resolve();
            }
          });
        });
      }

      // Pequeño delay para evitar parpadeos
      await new Promise((r) => setTimeout(r, 200));

      // Ocultamos el splash nativo para mostrar la Splashscreen in-app
      try {
        await SplashScreen.hideAsync();
      } catch (e) {}

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
    return () => {
      mounted = false;
      if (timeoutHandle) clearTimeout(timeoutHandle);
    };
  }, [rehydrated]);

  // Mientras showInAppSplash es true mostramos el componente Splashscreen
  if (showInAppSplash) {
    // Importar dinámicamente el componente desde el layout público (auth)
    const AppSplash = require("../auth/Splashscreen").default;
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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppLoader>
          <RootContent />
        </AppLoader>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
