import { createClient } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuthLoginWithGoogle } from "@/hooks/useAuth";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useAuthSessionStore } from "@/store/authSessionStore";
// Completa el proceso de autenticación si la aplicación fue abierta desde un navegador web
WebBrowser.maybeCompleteAuthSession();

//Credenciales - ACTUALIZA ESTOS VALORES desde Supabase Settings → API
const supabaseUrl = "https://mjuflmbpbpsltvbjuqzj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdWZsbWJwYnBzbHR2Ymp1cXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzQ5MzYsImV4cCI6MjA4MTE1MDkzNn0.4be5UDBeAS1PULHBqxnudo9-i3zOi4Ft5JDVICIhqpg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BtnGoogle({ loading: externalLoading = false } = {}) {
  const [loading, setLoading] = useState(externalLoading);
  const { mutate: postLoginGoogle } = useAuthLoginWithGoogle();
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const { alertConfig, isVisible, hideAlert, showSuccess, showError } =
    useCustomAlert();

  //Escuchar deep Links para capturar la respuesta de OAuth
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  // Verificar si hay un deep link inicial
  useEffect(() => {
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl != null) {
        handleDeepLink({ url: initialUrl });
      }
    });
  }, []);

  const handleDeepLink = async ({ url }: { url: string }) => {
    setDeepLink(url);

    // Procesar la URL si contiene tokens (formato hash o query params)
    if (url.includes("#access_token") || url.includes("?access_token")) {
      try {
        // Cerrar el navegador web si está abierto
        WebBrowser.dismissBrowser();

        let params;

        // Manejar formato con hash (#)
        if (url.includes("#access_token")) {
          params = new URL(url.replace("#", "?")).searchParams;
        } else {
          // Manejar formato con query params (?)
          params = new URL(url).searchParams;
        }

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            Alert.alert("Error", sessionError.message);
            setLoading(false);
          } else {
            const {
              data: { user },
              error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
              Alert.alert(
                "Error",
                "No se pudo obtener la información del usuario",
              );
              setLoading(false);
              return;
            }

            const userData = {
              email: user.email || '',
              idGoogle: user.id,
              fullName: user.user_metadata?.full_name || '',
            };

            postLoginGoogle(userData, {
              onSuccess: (responseData) => {
                setLoading(false);
                
                const profileCompleted = responseData?.user?.profileCompleted;
                const acceptTerms = responseData?.user?.acceptTerms;
                
                if (profileCompleted && acceptTerms) {
                  // Ir directamente a HomeScreen (verificará trabajos allá)
                  showSuccess(
                    "¡Inicio de sesión exitoso!",
                    "Bienvenido de nuevo.",
                    {
                      customImage: require("../../assets/images/welcome.png"),
                      imageStyle: { width: 500, height: 300 },
                      primaryButtonText: "Continuar",
                      onPrimaryPress: () => {
                        hideAlert();
                        router.replace("/(tabs)/HomeScreen");
                      },
                    },
                  );
                } else {
                  // Ir a OnboardingScreen
                  showSuccess(
                    "¡Inicio de sesión exitoso!",
                    "Completa tu perfil para continuar.",
                    {
                      customImage: require("../../assets/images/welcome.png"),
                      imageStyle: { width: 500, height: 300 },
                      primaryButtonText: "Continuar",
                      onPrimaryPress: () => {
                        hideAlert();
                        router.replace("/(tabs)/OnboardingScreen");
                      },
                    },
                  );
                }
              },
              onError: (error) => {
                setLoading(false);
                showError(
                  "Error de autenticación",
                  error.response?.data?.message || error.message || "No se pudo iniciar sesión con Google",
                );
              },
            });
          }
        } else {

          Alert.alert(
            "Error",
            "No se pudieron obtener los tokens de autenticación",
          );
          setLoading(false);
        }
      } catch (error: any) {
        Alert.alert(
          "Error",
          "Error al procesar la autenticación: " + (error?.message || 'Error desconocido'),
        );
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // 🔥 PASO 1: Limpiar sesión previa (importante)
      await supabase.auth.signOut();

      // IMPORTANTE: Usar Linking.createURL para que Expo lo maneje correctamente
      const redirectUrl = Linking.createURL("auth");

      // 🔥 PASO 2: Forzar selección de cuenta
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: "offline",
            prompt: "consent", // Forzar consentimiento para asegurar que funcione
          },
        },
      });

      if (error) {
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      if (data?.url) {
        // Intentar abrir el navegador - CRÍTICO para React Native
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        if (result.type === "success" && result.url) {
          // En React Native, necesitamos manejar el resultado directamente
          await handleDeepLink({ url: result.url });
        } else if (result.type === "dismiss" || result.type === "cancel") {
          setLoading(false);
        }
      } else {
        Alert.alert("Error", "No se pudo iniciar la autenticación con Google");
        setLoading(false);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Ocurrió un error");
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={handleGoogleLogin}
      disabled={loading}
    >
      <View style={styles.googleIconContainer}>
        <View style={styles.googleIcon}>
          <Image
            source={require("../../assets/google.png")}
            style={styles.googleIconImage}
          />
        </View>
      </View>
      <Text style={styles.googleButtonText}>Continuar con Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 12,
  },
  logoBadge: {
    width: 56,
    height: 56,
    backgroundColor: "#F4C542",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  briefcaseIcon: {
    width: 28,
    height: 28,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  briefcaseHandle: {
    position: "absolute",
    top: 2,
    left: 8,
    width: 12,
    height: 6,
    borderWidth: 2.5,
    borderColor: "#1E3A5F",
    borderBottomWidth: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  briefcaseBody: {
    position: "absolute",
    top: 7,
    left: 2,
    width: 24,
    height: 18,
    backgroundColor: "transparent",
    borderWidth: 2.5,
    borderColor: "#1E3A5F",
    borderRadius: 3,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1E3A5F",
  },
  tagline: {
    fontSize: 16,
    color: "#5A6C7D",
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8A8A8A",
  },
  activeTabText: {
    color: "#1E3A5F",
    fontWeight: "600",
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3748",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#2D3748",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#2D3748",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeOuter: {
    width: 22,
    height: 14,
    borderWidth: 2,
    borderColor: "#8A8A8A",
    borderRadius: 11,
    position: "absolute",
  },
  eyeSlash: {
    width: 26,
    height: 2,
    backgroundColor: "#8A8A8A",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#3B82C8",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#1E3A5F",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D0D0",
  },
  dividerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 14,
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleIcon: {
    width: 34,
    height: 24,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  googleIconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 13,
    color: "#8A8A8A",
  },
  termsLink: {
    fontSize: 13,
    color: "#3B82C8",
    fontWeight: "500",
  },
});
