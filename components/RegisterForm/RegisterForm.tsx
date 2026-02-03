import { IUserCreate } from "@/app/types/IUserData.type";
import { useAuthRegister } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Usa el hook de TanStack Query
  const { mutate: registerUser, isPending, isError, error } = useAuthRegister();
  
  const {
    control,
    handleSubmit: onSubmitRHF,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: ""
    },
    mode: "onChange",
  });

  const handleSubmit = (data: IUserCreate) => {
    // Llama a la mutación
    registerUser(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password
      },
      {
        // Callbacks opcionales específicos para esta llamada
        onSuccess: (response) => {
          Alert.alert(
            "Éxito",
            "Usuario registrado correctamente",
            [
              {
                text: "OK",
                onPress: () => {
                  reset(); 
                  router.push('/auth/VerifyAccounts', );
                }
              }
            ]
          );
        },
        onError: (err: any) => {
          const errorMessage = err?.response?.data?.message || 
                               err?.message || 
                               "Error al registrar usuario";
          Alert.alert("Error", errorMessage);
        }
      }
    );
  };

  return (
    <View style={styles.formContainer}>
      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre Completo</Text>
        <Controller
          control={control}
          name="fullName"
          rules={{ required: "El nombre completo es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre completo"
              placeholderTextColor="#B0B0B0"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              autoCapitalize="words"
            />
          )}
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName.message}</Text>
        )}
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El correo electrónico es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un correo electrónico válido",
            },
          }}
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
          rules={{ 
            required: "La contraseña es obligatoria",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres"
            }
          }}
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

      {/* User Type Selection */}
     

      {/* Checkbox para condiciones y terminos */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
          {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          Acepto los{" "}
          <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{" "}
          <Text style={styles.termsLink}>Política de Privacidad</Text>
        </Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        style={[
          styles.registerButton,
          (!agreeTerms || isPending) && styles.registerButtonDisabled,
        ]}
        onPress={onSubmitRHF(handleSubmit)}
        disabled={!agreeTerms || isPending}
      >
        <Text style={styles.registerButtonText}>
          {isPending ? "Registrando..." : "Registrarse"}
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginLinkText}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.loginLink}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
      {/* verificacion de cuenta */}
      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginLinkText}>¿Ya te registraste y no verificaste tu cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/VerifyAccounts')}>
          <Text style={styles.loginLink}>Click aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingBottom: 30,
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
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },
  // NUEVOS ESTILOS para selección de tipo de usuario
  userTypeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  userTypeButtonActive: {
    borderColor: "#1E3A5F",
    backgroundColor: "#1E3A5F",
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
  },
  userTypeTextActive: {
    color: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: "#1E3A5F",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: "#B0B0B0",
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#1E3A5F",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#1E3A5F",
    borderColor: "#1E3A5F",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 13,
    color: "#8A8A8A",
    flex: 1,
  },
  termsLink: {
    fontSize: 13,
    color: "#3B82C8",
    fontWeight: "500",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginLinkText: {
    fontSize: 15,
    color: "#5A6C7D",
  },
  loginLink: {
    fontSize: 15,
    color: "#3B82C8",
    fontWeight: "600",
  },
});