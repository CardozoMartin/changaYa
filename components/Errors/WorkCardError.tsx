import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
interface WorkCardErrorProps {
  onRetry?: () => void;
  errorMessage?: string;
}

export default function WorkCardError({ onRetry, errorMessage }: WorkCardErrorProps) {
  return (
    <View style={styles.errorCard}>
      {/* Icono de error */}
      <View style={styles.errorIconContainer}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>!</Text>
        </View>
      </View>

      {/* Mensaje de error */}
      <Text style={styles.errorTitle}>Ocurrio un problema</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>

      {/* Botón de reintentar */}
      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <View style={styles.retryIcon}>
            <View style={styles.retryArrow} />
          </View>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorIconContainer: {
    marginBottom: 16,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#EF4444',
  },
  errorIconText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EF4444',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D111B',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    position: 'relative',
  },
  retryArrow: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 2,
    transform: [{ rotate: '135deg' }],
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});