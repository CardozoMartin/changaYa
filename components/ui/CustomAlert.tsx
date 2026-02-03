import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ImageSourcePropType,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  customImage?: ImageSourcePropType;
  imageStyle?: object;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  primaryButtonText = 'Aceptar',
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  autoClose = false,
  autoCloseDelay = 3000,
  customImage,
  imageStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
    handleClose();
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    handleClose();
  };

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          iconColor: '#10B981',
          backgroundColor: '#D1FAE5',
          borderColor: '#10B981',
        };
      case 'error':
        return {
          icon: '✕',
          iconColor: '#EF4444',
          backgroundColor: '#FEE2E2',
          borderColor: '#EF4444',
        };
      case 'warning':
        return {
          icon: '!',
          iconColor: '#F59E0B',
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
        };
      case 'info':
        return {
          icon: 'i',
          iconColor: '#2563EB',
          backgroundColor: '#DBEAFE',
          borderColor: '#2563EB',
        };
      default:
        return {
          icon: 'i',
          iconColor: '#2563EB',
          backgroundColor: '#DBEAFE',
          borderColor: '#2563EB',
        };
    }
  };

  const config = getAlertConfig();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icono o Imagen */}
          <View
            style={[
              styles.iconContainer,
              customImage && styles.imageContainer,
              !customImage && {
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
              },
            ]}
          >
            {customImage ? (
              <Image
                source={customImage}
                style={[styles.customImage, imageStyle]}
                resizeMode="contain"
              />
            ) : (
              <Text style={[styles.icon, { color: config.iconColor }]}>
                {config.icon}
              </Text>
            )}
          </View>

          {/* Contenido */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            {secondaryButtonText && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleSecondaryPress}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: config.iconColor },
                secondaryButtonText && styles.buttonHalf,
              ]}
              onPress={handlePrimaryPress}
            >
              <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  alertContainer: {
    width: width - 60,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: 100,
    height: 100,
  },
  customImage: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: 40,
    fontWeight: '700',
  },
  contentContainer: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#5A6C7D',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHalf: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  secondaryButtonText: {
    color: '#5A6C7D',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
