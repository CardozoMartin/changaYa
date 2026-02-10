import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface ProfileErrorProps {
  onRetry?: () => void;
  errorMessage?: string;
}

export default function ProfileError({ onRetry, errorMessage = 'Ocurrió un error inesperado' }: ProfileErrorProps) {


  return (
     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.settingsButton} disabled>
          <Ionicons name="settings-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Error Content */}
      <View style={styles.errorContainer}>
        {/* Error Icon */}
        <View style={styles.errorIconContainer}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle" size={80} color="#EF4444" />
          </View>
        </View>

        {/* Error Message */}
        <Text style={styles.errorTitle}>¡Ups! Algo salió mal</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        {/* Error Details */}
        <View style={styles.errorDetailsCard}>
          <View style={styles.errorDetailItem}>
            <Ionicons name="cloud-offline" size={24} color="#6B7280" />
            <Text style={styles.errorDetailText}>
              Verifica tu conexión a internet
            </Text>
          </View>
          <View style={styles.errorDetailItem}>
            <Ionicons name="refresh" size={24} color="#6B7280" />
            <Text style={styles.errorDetailText}>
              Intenta recargar la página
            </Text>
          </View>
          <View style={styles.errorDetailItem}>
            <Ionicons name="time" size={24} color="#6B7280" />
            <Text style={styles.errorDetailText}>
              Si el problema persiste, inténtalo más tarde
            </Text>
          </View>
        </View>

        {/* Retry Button */}
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#fff" style={styles.retryIcon} />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        )}

        {/* Alternative Action */}
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
          <Ionicons  name="help-circle-outline" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>Contactar Soporte</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#1E3A8A",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  settingsButton: {
    padding: 8,
    opacity: 0.5,
  },
  errorContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#FECACA",
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  errorDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  errorDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  errorDetailText: {
    fontSize: 15,
    color: "#4B5563",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    marginBottom: 12,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginLeft: 8,
  },
});
