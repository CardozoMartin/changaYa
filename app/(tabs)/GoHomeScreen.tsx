import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function GoHomeScreen() {
  const [selectedRole, setSelectedRole] = useState(null); // 'hire' o 'work'

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ChambaYa</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>¡Bienvenido a</Text>
          <Text style={styles.welcomeTitle}>ChambaYa!</Text>
          <Text style={styles.welcomeSubtitle}>¿Cómo usarás la aplicación?</Text>
        </View>

        {/* Role Selection Cards */}
        <View style={styles.cardsContainer}>
          {/* Quiero Contratar Card */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedRole === 'hire' && styles.cardSelected,
            ]}
            onPress={() => setSelectedRole('hire')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.iconBlue]}>
              <View style={styles.searchIcon}>
                <View style={styles.searchCircle} />
                <View style={styles.searchHandle} />
              </View>
            </View>
            <Text style={styles.cardTitle}>Quiero contratar</Text>
            <Text style={styles.cardDescription}>
              Encuentra profesionales para tus proyectos y tareas.
            </Text>
          </TouchableOpacity>

          {/* Quiero Trabajar Card */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedRole === 'work' && styles.cardSelected,
            ]}
            onPress={() => setSelectedRole('work')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.iconLightBlue]}>
              <View style={styles.toolsIcon}>
                <View style={styles.wrench} />
                <View style={styles.hammer} />
              </View>
            </View>
            <Text style={styles.cardTitle}>Quiero trabajar</Text>
            <Text style={styles.cardDescription}>
              Encuentra oportunidades laborales y conecta con clientes.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer to push button to bottom */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled
          ]}
          disabled={!selectedRole}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Learn More Link */}
        <TouchableOpacity style={styles.learnMoreContainer}>
          <Text style={styles.learnMoreText}>Aprende más sobre los roles</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 44,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#2563EB',
    borderWidth: 3,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBlue: {
    backgroundColor: '#2563EB',
  },
  iconLightBlue: {
    backgroundColor: '#DBEAFE',
  },
  searchIcon: {
    width: 28,
    height: 28,
    position: 'relative',
  },
  searchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  searchHandle: {
    width: 3,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
    right: 4,
    transform: [{ rotate: '45deg' }],
  },
  toolsIcon: {
    width: 28,
    height: 28,
    position: 'relative',
  },
  wrench: {
    width: 16,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: 2,
    transform: [{ rotate: '45deg' }],
  },
  hammer: {
    width: 3,
    height: 20,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    position: 'absolute',
    top: 4,
    right: 6,
    transform: [{ rotate: '-45deg' }],
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
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
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  learnMoreContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  learnMoreText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
});