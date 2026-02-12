import CustomAlert from '@/components/ui/CustomAlert';
import { useVerifyAccount } from '@/hooks/useAuth';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Clipboard,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function VerifyAccountScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Custom Alert Hook
  const { alertConfig, isVisible, hideAlert, showSuccess, showError } = useCustomAlert();

  // Hooks para la verificación
  const { mutate: verifyAccount, isPending } = useVerifyAccount();

  // Contador regresivo
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-focus al primer input cuando se monta el componente
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Detectar código copiado en el portapapeles
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const clipboardContent = await Clipboard.getString();
        // Verificar si es un código válido alfanumérico de 6 caracteres
        if (/^[A-Za-z0-9]{6}$/.test(clipboardContent)) {
          const codeArray = clipboardContent.toUpperCase().split('');
          setCode(codeArray);
          // Focus al último input
          inputRefs.current[5]?.focus();
        }
      } catch (error) {
      }
    };
    
    // Verificar portapapeles cuando se monta el componente
    checkClipboard();
  }, []);

  // Formatear tiempo mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar cambio en los inputs
  const handleChange = (text: string, index: number) => {
    // Permite letras y números (alfanumérico)
    if (!/^[a-zA-Z0-9]*$/.test(text)) return;

    const newCode = [...code];
    
    // Si pegan múltiples caracteres (código completo)
    if (text.length > 1) {
      const pastedCode = text.slice(0, 6).toUpperCase().split('');
      for (let i = 0; i < pastedCode.length && index + i < 6; i++) {
        newCode[index + i] = pastedCode[i];
      }
      setCode(newCode);
      // Focus al último input o al siguiente después del pegado
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newCode[index] = text.toUpperCase();
    setCode(newCode);

    // Auto-focus al siguiente input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Manejar borrado
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Reenviar código
  const handleResendCode = () => {
    if (timer > 0) return;
    
    setTimer(45);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    // Aquí deberías llamar a tu API para reenviar el código
  };

  // Verificar código
  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      verifyAccount(
        { code: verificationCode },
        {
          onSuccess: (data) => {
            showSuccess(
              '',
              'Tu cuenta ha sido verificada exitosamente. Bienvenido a ChangaYa.',
              {
                customImage: require('../../assets/images/successverificacion.png'),
                imageStyle: { width: 500, height: 300 },
                primaryButtonText: 'Continuar',
                onPrimaryPress: () => {
                  router.push('/auth/LoginScreen');
                },
              }
            );
          },
          onError: (error: any) => {
            showError(
              '',
              'El código ingresado no es válido. Por favor, verifica e intenta nuevamente.',
              {
                customImage: require('../../assets/images/errorverificacion.png'),
                imageStyle: { width: 500, height: 300 },
                primaryButtonText: 'Reintentar',
              }
            );
          },
        }
      );
    }
  };

  // Función para pegar desde portapapeles manualmente
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      const cleanCode = clipboardContent.replace(/[^A-Za-z0-9]/g, '').slice(0, 6);
      
      if (cleanCode.length > 0) {
        const codeArray = cleanCode.toUpperCase().split('');
        const newCode = [...code];
        
        for (let i = 0; i < codeArray.length && i < 6; i++) {
          newCode[i] = codeArray[i];
        }
        
        setCode(newCode);
        inputRefs.current[Math.min(codeArray.length, 5)]?.focus();
      }
    } catch (error) {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    
      
      {/* Header con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/auth/RegisterScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Icono de seguridad mejorado */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Image 
              source={require('../../assets/images/iconosecure.png')} 
              style={styles.logoImage} 
            />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Verifica tu cuenta</Text>

        {/* Descripción mejorada */}
        <Text style={styles.description}>
          Hemos enviado un código de 6 caracteres{'\n'}
          a tu <Text style={styles.highlight}>correo electrónico</Text>
        </Text>

        {/* Inputs de código con mejor diseño */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <React.Fragment key={index}>
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled,
                  focusedIndex === index && styles.codeInputFocused,
                ]}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                keyboardType="default"
                autoCapitalize="characters"
                autoComplete={index === 0 ? "sms-otp" : "off"}
                textContentType={index === 0 ? "oneTimeCode" : "none"}
                maxLength={index === 0 ? 6 : 1}
                selectTextOnFocus
                returnKeyType={index === 5 ? "done" : "next"}
                onSubmitEditing={() => {
                  if (index < 5) {
                    inputRefs.current[index + 1]?.focus();
                  } else if (code.every(d => d)) {
                    handleVerify();
                  }
                }}
              />
              {/* Separador visual */}
              {index === 2 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>

        {/* Botón para pegar código */}
        <TouchableOpacity
          style={styles.pasteButton}
          onPress={handlePasteFromClipboard}
          activeOpacity={0.7}
        >
          <Text style={styles.pasteButtonText}>📋 Pegar código</Text>
        </TouchableOpacity>

        {/* Timer y reenviar código */}
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResendCode}
          disabled={timer > 0}
          activeOpacity={0.7}
        >
          <View style={styles.timerIconContainer}>
            <Text style={styles.timerEmoji}>⏱️</Text>
          </View>
          <Text style={[
            styles.resendText,
            timer === 0 && styles.resendTextActive
          ]}>
            {timer > 0 ? (
              <>
                Reenviar código en{' '}
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
              </>
            ) : (
              'Toca para reenviar código'
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer con botón y soporte */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            code.every(d => d) && styles.verifyButtonActive
          ]}
          onPress={handleVerify}
          disabled={!code.every(d => d) || isPending}
          activeOpacity={0.9}
        >
          <Text style={styles.verifyButtonText}>
            {isPending ? 'Verificando...' : 'Verificar →'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.supportText}>
          ¿Necesitas ayuda?{' '}
          <Text style={styles.supportLink}>Contactar soporte</Text>
        </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#1A202C',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  iconBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 230,
    height: 230,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  highlight: {
    color: '#1A202C',
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  codeInput: {
    width: 48,
    height: 60,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1A202C',
    backgroundColor: '#F8FAFC',
  },
  codeInputFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  codeInputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  separator: {
    width: 12,
    height: 2,
    backgroundColor: '#CBD5E0',
    borderRadius: 1,
    marginHorizontal: 4,
  },
  pasteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  pasteButtonText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  timerIconContainer: {
    marginRight: 8,
  },
  timerEmoji: {
    fontSize: 18,
  },
  resendText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  resendTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  timerText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#93C5FD',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyButtonActive: {
    backgroundColor: '#2563EB',
    shadowOpacity: 0.3,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  supportText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  supportLink: {
    color: '#2563EB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});