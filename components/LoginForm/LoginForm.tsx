import CustomAlert from "@/components/ui/CustomAlert";
import { useAuthLogin } from "@/hooks/useAuth";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import BtnGoogle from "./BtnGoogle";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const { alertConfig, isVisible, hideAlert, showSuccess, showError } =
    useCustomAlert();
  
  // Callback simple - solo navegar a HomeScreen u Onboarding
  const handleLoginSuccess = async (responseData: any) => {
    const profileCompleted = responseData?.user?.profileCompleted;
    const acceptTerms = responseData?.user?.acceptTerms;
    
    if (profileCompleted && acceptTerms) {
      // Ir a HomeScreen (verificará trabajos allá)
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
      // Ir a Onboarding
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
  
  const { mutate: loginMutate, isPending, isError } = useAuthLogin({
    onLoginSuccess: handleLoginSuccess,
  });

  const {
    control,
    handleSubmit: onSubmitRHF,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = (data: { email: string; password: string }) => {
    console.log("🟡 handleLogin llamado con:", data.email);
    loginMutate(
      { email: data.email, password: data.password },
      {
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.message ?? error?.message ?? null;
          console.warn('❌ Login failed - serverMessage:', serverMessage);

          if (serverMessage === "El usuario no está activo") {
            showError(
              "",
              "La cuenta no está verificada. Por favor, verifica tu correo electrónico.",
              {
                customImage: require("../../assets/images/errorverificacion.png"),
                imageStyle: { width: 500, height: 300 },
                primaryButtonText: "Reintentar",
              }
            );
          } else if (serverMessage) {
            showError("", serverMessage, {
              primaryButtonText: "Reintentar",
            });
          } else {
            showError("", "Contraseña o correo electrónico incorrectos.", {
              customImage: require("../../assets/images/credencialesinvalidas.png"),
              imageStyle: { width: 500, height: 300 },
              primaryButtonText: "Reintentar",
            });
          }
        },
      }
    );
  };
  return (
    <View style={styles.formContainer}>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "El email es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo"
              placeholderTextColor="#B0B0B0"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: "La contraseña es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#B0B0B0"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <View style={styles.eyeIcon}>
                  <View style={styles.eyeOuter} />
                  {!showPassword && <View style={styles.eyeSlash} />}
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>

      {/* Forgot Password Link */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={onSubmitRHF(handleLogin)}
      >
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerCircle} />
        <View style={styles.dividerLine} />
      </View>

      {/* Google Button */}
     <BtnGoogle />

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>Al registrarte, aceptas nuestros </Text>
        <TouchableOpacity>
          <Text style={styles.termsLink}>Términos y Condiciones</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>.</Text>
      </View>

      {/* Custom Alert */}
      {alertConfig && (
        <CustomAlert
          visible={isVisible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={hideAlert}
          primaryButtonText={alertConfig.primaryButtonText}
          secondaryButtonText={alertConfig.secondaryButtonText}
          onPrimaryPress={alertConfig.onPrimaryPress}
          onSecondaryPress={alertConfig.onSecondaryPress}
          autoClose={alertConfig.autoClose}
          autoCloseDelay={alertConfig.autoCloseDelay}
          customImage={alertConfig.customImage}
          imageStyle={alertConfig.imageStyle}
        />
      )}
    </View>
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
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: 6,
    marginLeft: 4,
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
