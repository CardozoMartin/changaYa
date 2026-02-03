import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');

  const handleContinue = () => {
    if (selectedRole === 'contratar') {
      router.push('/PublishJobScreen');
    } else if (selectedRole === 'trabajar') {
      router.push('/OpportunitiesScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Header con logo */}
        <View style={styles.header}>
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
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>
            ¡Bienvenido a ChamgaYa!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            ¿Cómo usarás la aplicación?
          </Text>
        </View>

        {/* Role Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Contratar Option */}
          <TouchableOpacity
            onPress={() => setSelectedRole('contratar')}
            style={[
              styles.card,
              selectedRole === 'contratar' && styles.cardSelected
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <View style={styles.searchIcon}>
                  {/* Ícono de búsqueda simple */}
                  <View style={styles.searchCircle} />
                  <View style={styles.searchHandle} />
                </View>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>
                  Quiero contratar
                </Text>
                <Text style={styles.cardDescription}>
                  Encuentra profesionales para tus proyectos y tareas.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Trabajar Option */}
          <TouchableOpacity
            onPress={() => setSelectedRole('trabajar')}
            style={[
              styles.card,
              selectedRole === 'trabajar' && styles.cardSelected
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <View style={styles.briefcaseIconSmall}>
                  {/* Ícono de maletín */}
                  <View style={styles.briefcaseHandle} />
                  <View style={styles.briefcaseBody} />
                </View>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>
                  Quiero trabajar
                </Text>
                <Text style={styles.cardDescription}>
                  Encuentra oportunidades laborales y conecta con clientes.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedRole}
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Continuar
          </Text>
        </TouchableOpacity>

        {/* Footer Link */}
        <View style={styles.footerContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLink}>
              Aprende más sobre los roles
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoBadge: {
    width: 56,
    height: 56,
    backgroundColor: '#F4C542',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  briefcaseIcon: {
    width: 28,
    height: 28,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#5A6C7D',
    textAlign: 'center',
    fontWeight: '500',
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#1E3A5F',
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  searchIcon: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  searchHandle: {
    width: 8,
    height: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  briefcaseIconSmall: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  briefcaseHandle: {
    position: 'absolute',
    top: 2,
    left: 6,
    width: 12,
    height: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderBottomWidth: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  briefcaseBody: {
    position: 'absolute',
    top: 6,
    left: 2,
    width: 20,
    height: 14,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 3,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#5A6C7D',
    lineHeight: 20,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: '#D0D0D0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: '#3B82C8',
    fontWeight: '500',
  },
   logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 5,
  },
  iconBackground: {
    width: 100,
    height: 100,
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
  }
});

export default HomeScreen;