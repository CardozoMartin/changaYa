import { createClient } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
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
import { checkWorksActiveFn } from "@/services/auth/work.services";

import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

// Completa el proceso de autenticación si la aplicación fue abierta desde un navegador web
WebBrowser.maybeCompleteAuthSession();

//Credenciales - ACTUALIZA ESTOS VALORES desde Supabase Settings → API
const supabaseUrl = "https://mjuflmbpbpsltvbjuqzj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdWZsbWJwYnBzbHR2Ymp1cXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzQ5MzYsImV4cCI6MjA4MTE1MDkzNn0.4be5UDBeAS1PULHBqxnudo9-i3zOi4Ft5JDVICIhqpg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BtnGoogle({ loading: externalLoading = false } = {}) {
  const [loading, setLoading] = useState(externalLoading);
  const [deepLink, setDeepLink] = useState(null);
  const router = useRouter();
  
  const { alertConfig, isVisible, hideAlert, showSuccess, showError } =
    useCustomAlert();

  // Callback personalizado que se ejecuta cuando el login es exitoso
  const handleGoogleLoginSuccess = async (responseData: any) => {
    console.log("🟢 [BtnGoogle] Callback ejecutado");
    console.log("✅ Token recibido:", responseData?.token?.substring(0, 20) + "...");
    console.log("✅ Usuario recibido:", responseData?.user);
    
    // ⏳ Esperar a que el token se guarde
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // ✅ Llamar directamente a la función para verificar trabajos
      const workData = await checkWorksActiveFn();
      console.log('✅ [BtnGoogle] checkWorksActiveFn response:', workData);
      
      // 🔥 VERIFICAR SI HAY TRABAJOS ACTIVOS
      if (workData?.hasActiveWork && workData?.works && workData.works.length > 0) {
        const activeWork = workData.works[0]; // Primer trabajo activo
        const role = workData.role;
        const completionStatus = activeWork.completionStatus;
        const workerId = activeWork.workerId;
        const employerId = activeWork.employerId;
        const workId = activeWork.workId;
        
        console.log('🔍 [BtnGoogle] Trabajo activo encontrado:', {
          role,
          status: activeWork.status,
          completionStatus,
          workId
        });

        // 🔥 VERIFICAR SI ES WORKER Y TIENE TRABAJO PENDIENTE DE CONFIRMAR
        if (role === 'worker' && completionStatus?.workerConfirmed === false) {
          console.log('🔄 [BtnGoogle] Redirigiendo a Rateworkerscreen (worker)');
          setLoading(false);
          router.push({
            pathname: "/(tabs)/Rateworkerscreen",
            params: {
              employerId,
              workId,
              workerId
            }
          });
          return;
        } 
        // 🔥 VERIFICAR SI ES EMPLOYER Y TIENE TRABAJO PENDIENTE DE CONFIRMAR
        else if (role === 'employer' && completionStatus?.employerConfirmed === false) {
          console.log('🔄 [BtnGoogle] Redirigiendo a Rateworkerscreen (employer)');
          setLoading(false);
          router.push({
            pathname: "/(tabs)/Rateworkerscreen",
            params: {
              workerId,
              workId,
              employerId
            }
          });
          return;
        }
        
        // 🔥 VERIFICAR SI HAY TRABAJOS EN PROGRESO
        if (activeWork.status === "in_progress") {
          console.log('🔄 [BtnGoogle] Trabajo en progreso detectado');
          setLoading(false);
          showSuccess(
            "¡Bienvenido de nuevo!", 
            `Tienes un trabajo pendiente: "${activeWork.workTitle}"`, 
            {
              customImage: require("../../assets/images/welcome.png"),
              imageStyle: { width: 500, height: 300 },
              primaryButtonText: "Finalizar Trabajo",
              onPrimaryPress: () => {
                hideAlert();
                router.push({
                  pathname: "/(tabs)/RateEmployerScreen",
                  params: { 
                    workId: activeWork.workId,
                    applicationId: activeWork.applicationId,
                    workTitle: activeWork.workTitle
                  }
                });
              },
            }
          );
          return;
        }
      }
      
    } catch (workError: any) {
      console.log('⚠️ [BtnGoogle] Error verificando trabajos:', workError);
      // Continuar con flujo normal si hay error
    }
    
    // 🔥 FLUJO NORMAL - Redirigir según perfil
    setLoading(false);
    const profileCompleted = responseData?.user?.profileCompleted;
    const acceptTerms = responseData?.user?.acceptTerms;
    
    if (profileCompleted && acceptTerms) {
      console.log('✅ [BtnGoogle] Perfil completo, redirigiendo a HomeScreen');
      showSuccess("¡Inicio de sesión exitoso!", "Bienvenido de nuevo.", {
        customImage: require("../../assets/images/welcome.png"),
        imageStyle: { width: 500, height: 300 },
        primaryButtonText: "Continuar",
        onPrimaryPress: () => {
          hideAlert();
          router.push("/(tabs)/HomeScreen");
        },
      });
    } else {
      console.log('⚠️ [BtnGoogle] Perfil incompleto, redirigiendo a OnboardingScreen');
      showSuccess("¡Inicio de sesión exitoso!", "Completa tu perfil.", {
        customImage: require("../../assets/images/welcome.png"),
        imageStyle: { width: 500, height: 300 },
        primaryButtonText: "Completar Perfil",
        onPrimaryPress: () => {
          hideAlert();
          router.push("/(tabs)/OnboardingScreen");
        },
      });
    }
  };

  const { mutate: postLoginGoogle } = useAuthLoginWithGoogle({
    onLoginSuccess: handleGoogleLoginSuccess,
  });

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

  const handleDeepLink = async ({ url }) => {
    console.log('🔗 [handleDeepLink] URL recibida:', url);
    
    // ⚠️ IMPORTANTE: Solo procesar si estamos en proceso de login
    // Esto evita que se procese automáticamente al abrir la app después de logout
    if (!loading) {
      console.log('⚠️ [handleDeepLink] No hay login en curso, ignorando deep link');
      return;
    }
    
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

        console.log("🔑 Tokens recibidos:", {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
        });

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error("❌ Error al establecer sesión:", sessionError);
            Alert.alert("Error", sessionError.message);
            setLoading(false);
          } else {
            const {
              data: { user },
              error: userError,
            } = await supabase.auth.getUser();

            console.log("👤 Usuario de Supabase:", user);

            if (userError) {
              console.error("❌ Error al obtener usuario:", userError);
              Alert.alert(
                "Error",
                "No se pudo obtener la información del usuario"
              );
              setLoading(false);
              return;
            }

            const userData = {
              email: user.email,
              idGoogle: user.id,
              fullName: user.user_metadata.full_name,
            };

            console.log("🚀 [handleDeepLink] Enviando datos al backend:", userData);
            console.log("📞 [handleDeepLink] Llamando a postLoginGoogle...");
            
            postLoginGoogle(userData, {
              onSuccess: (data) => {
                console.log("✅ [handleDeepLink] onSuccess inline ejecutado!");
                console.log("✅ [handleDeepLink] Data recibida del backend:", data);
                // El hook también tiene onSuccess que ejecutará el callback
              },
              onError: (error) => {
                console.error("❌ [handleDeepLink] Error en login con Google:", error);
                setLoading(false);
                showError(
                  "Error de autenticación",
                  error.response?.data?.message ||
                    error.message ||
                    "No se pudo iniciar sesión con Google"
                );
              },
            });
          }
        } else {
          console.error("❌ No se recibieron los tokens");
          Alert.alert(
            "Error",
            "No se pudieron obtener los tokens de autenticación"
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error procesando deep link:", error);
        Alert.alert(
          "Error",
          "Error al procesar la autenticación: " + error.message
        );
        setLoading(false);
      }
    } else {
      console.log("⚠️ URL sin tokens, ignorando:", url);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // 🔥 PASO 1: Limpiar sesión previa (importante)
      await supabase.auth.signOut();
      console.log("🧹 Sesión anterior limpiada");

      // IMPORTANTE: Usar Linking.createURL para que Expo lo maneje correctamente
      const redirectUrl = Linking.createURL("auth");

      console.log("🔗 Redirect URL:", redirectUrl);
      console.log("🔗 Iniciando login con Google...");

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
        console.error("❌ Error OAuth:", error);
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      if (data?.url) {
        console.log("📱 Abriendo navegador con URL de Google...");
        console.log("📱 URL completa:", data.url);

        // Intentar abrir el navegador - CRÍTICO para React Native
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log("🔍 Resultado de WebBrowser:", result);

        if (result.type === "success" && result.url) {
          // En React Native, necesitamos manejar el resultado directamente
          console.log("✅ Autenticación exitosa, procesando URL:", result.url);
          await handleDeepLink({ url: result.url });
        } else if (result.type === "dismiss" || result.type === "cancel") {
          console.log("⚠️ Usuario cerró el navegador");
          setLoading(false);
        }
      } else {
        console.error("❌ No hay URL de OAuth disponible");
        Alert.alert("Error", "No se pudo iniciar la autenticación con Google");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Error en handleGoogleLogin:", error);
      Alert.alert("Error", error.message || "Ocurrió un error");
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
      <Text style={styles.googleButtonText}>
        {loading ? "Cargando..." : "Continuar con Google"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});