import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header con logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.briefcaseIcon}>
            <View style={styles.briefcaseHandle} />
            <View style={styles.briefcaseBody} />
          </View>
          <Text style={styles.logoText}>ChambaYa</Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Imagen de la mano */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBackground}>
            <View style={styles.arm}>
              <View style={styles.sleeve} />
              <View style={styles.hand}>
                <View style={styles.thumb} />
                <View style={styles.finger1} />
                <View style={styles.finger2} />
                <View style={styles.finger3} />
              </View>
            </View>
          </View>
        </View>

        {/* Texto principal */}
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Encuentra tu</Text>
          <Text style={styles.mainTitle}>próximo trabajo o al</Text>
          <Text style={styles.mainTitle}>profesional ideal.</Text>
          
          <Text style={styles.subtitle}>Conectamos oportunidades con talento.</Text>
          <Text style={styles.subtitle}>Rápido y seguro.</Text>
        </View>

        {/* Botón de registro */}
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Registrarse Gratis</Text>
        </TouchableOpacity>

        {/* Link de inicio de sesión */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  briefcaseIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
    position: 'relative',
  },
  briefcaseHandle: {
    position: 'absolute',
    top: 2,
    left: 10,
    width: 12,
    height: 8,
    borderWidth: 3,
    borderColor: '#1E3A5F',
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  briefcaseBody: {
    position: 'absolute',
    top: 8,
    left: 2,
    width: 28,
    height: 20,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#1E3A5F',
    borderRadius: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageBackground: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5C6A0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arm: {
    position: 'relative',
    width: 100,
    height: 220,
  },
  sleeve: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 80,
    height: 100,
    backgroundColor: '#2C5F6F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hand: {
    position: 'absolute',
    top: 0,
    left: 15,
    width: 70,
    height: 130,
    backgroundColor: '#D4956C',
    borderRadius: 35,
  },
  thumb: {
    position: 'absolute',
    top: 50,
    left: -10,
    width: 25,
    height: 40,
    backgroundColor: '#D4956C',
    borderRadius: 12,
    transform: [{ rotate: '-20deg' }],
  },
  finger1: {
    position: 'absolute',
    top: 10,
    left: 15,
    width: 18,
    height: 35,
    backgroundColor: '#C8845E',
    borderRadius: 9,
  },
  finger2: {
    position: 'absolute',
    top: 5,
    left: 35,
    width: 18,
    height: 38,
    backgroundColor: '#C8845E',
    borderRadius: 9,
  },
  finger3: {
    position: 'absolute',
    top: 12,
    right: 10,
    width: 16,
    height: 32,
    backgroundColor: '#C8845E',
    borderRadius: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E3A5F',
    textAlign: 'center',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A5A5A',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  registerButton: {
    backgroundColor: '#3B82C8',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  loginText: {
    fontSize: 16,
    color: '#5A5A5A',
  },
  loginLink: {
    fontSize: 16,
    color: '#1E3A5F',
    fontWeight: '600',
  },
});