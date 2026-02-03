import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const calledFinishRef = useRef(false);

  useEffect(() => {
    // Simulación de carga
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !calledFinishRef.current) {
      calledFinishRef.current = true;
      try { onFinish && onFinish(); } catch (e) { /* ignore */ }
    }
  }, [progress, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8EEF2" />
      
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        {/* Icono principal con badge */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconBackground}>
            {/* Icono de apretón de manos */}
            <Ionicons name="hand-left-outline" size={60} color="#FFF" style={styles.handIcon} />
          </View>
          {/* Badge amarillo con rayo */}
          <View style={styles.badge}>
            <Ionicons name="flash" size={16} color="#1E3A5F" />
          </View>
        </View>

        {/* Título ChangaYa */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleBlue}>Changa</Text>
          <Text style={styles.titleYellow}>Ya</Text>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Trabajo rápido, confianza total</Text>
      </View>

      {/* Progress Bar Container */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.loadingText}>Iniciando ChangaYa...</Text>
          <Text style={styles.percentageText}>{progress}%</Text>
        </View>
        
        {/* Barra de progreso */}
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v2.4.0 • © 2023 ChangaYa Inc.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEF2',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 30,
  },
  iconBackground: {
    width: 140,
    height: 140,
    backgroundColor: '#1E4D8B',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ rotate: '-5deg' }],
  },
  handIcon: {
    transform: [{ rotate: '-45deg' }, { scaleX: -1 }],
    marginLeft: -10,
    marginTop: -5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 38,
    height: 38,
    backgroundColor: '#F4C430',
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleBlue: {
    fontSize: 52,
    fontWeight: '800',
    color: '#1E4D8B',
    letterSpacing: -1,
  },
  titleYellow: {
    fontSize: 52,
    fontWeight: '800',
    color: '#F4C430',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#5F6F81',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: width - 80,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 15,
    color: '#1E4D8B',
    fontWeight: '700',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#CFD8E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E4D8B',
    borderRadius: 10,
  },
  footer: {
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#8A98A8',
    fontWeight: '400',
  },
});

export default SplashScreen;