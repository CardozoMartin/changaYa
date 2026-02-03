import { AlertType } from '@/components/ui/CustomAlert';
import { useCallback, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

interface AlertOptions {
  type: AlertType;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  customImage?: ImageSourcePropType;
  imageStyle?: object;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
    setIsVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setAlertConfig(null);
    }, 300);
  }, []);

  // Funciones helper para diferentes tipos de alertas
  const showSuccess = useCallback(
    (title: string, message: string, options?: Partial<AlertOptions>) => {
      showAlert({
        type: 'success',
        title,
        message,
        ...options,
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, options?: Partial<AlertOptions>) => {
      showAlert({
        type: 'error',
        title,
        message,
        ...options,
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, options?: Partial<AlertOptions>) => {
      showAlert({
        type: 'warning',
        title,
        message,
        ...options,
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, options?: Partial<AlertOptions>) => {
      showAlert({
        type: 'info',
        title,
        message,
        ...options,
      });
    },
    [showAlert]
  );

  return {
    alertConfig,
    isVisible,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
