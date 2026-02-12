import CardAplications from '@/components/Aplications/CardAplications';
import { useGetApplicationsByWork } from '@/hooks/useAplyToWork';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Tipos para las postulaciones (shape de la API)
interface Worker {
  id: string;
  fullName: string;
  email?: string;
  imageProfile?: string;
  description?: string;
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  worker: Worker;
}

const PostuladosScreen = () => {
  // Leer params
  const params = useLocalSearchParams();
  const jobId = params.jobId as string;
  const jobTitle = (params.jobTitle as string) ?? 'Postulados';

  // Hook para obtener las postulaciones (shape Application[])
  const { data: applications, isLoading: loadingApplications, error: applicationsError } = useGetApplicationsByWork(jobId);
  const dataJobs = applications as Application[] | undefined;
  console.log('PostuladosScreen - applications data:', dataJobs);

  


const handleSelectApplicant = (workerId: string) => {
}



  // Loading state
  if (loadingApplications) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1142d4" />
          <Text style={styles.loadingText}>Cargando postulantes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (applicationsError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error al cargar postulantes</Text>
          <Text style={styles.errorMessage}>
            {(applicationsError as any)?.message || 'Ocurrió un error inesperado'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View style={styles.backIcon}>
            <View style={styles.backArrow} />
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{jobTitle || 'Postulados'}</Text>

        <View style={styles.spacer} />
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de título y descripción */}
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>Trabajadores interesados</Text>
          <Text style={styles.subtitle}>
            Revisa los perfiles y selecciona al mejor para tu changa.
          </Text>
        </View>

        {/* Lista de postulantes */}
        {loadingApplications ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1142d4" />
            <Text style={styles.loadingText}>Cargando postulantes...</Text>
          </View>
        ) : applicationsError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{(applicationsError as any)?.message || 'No se pudieron cargar los postulantes'}</Text>
          </View>
        ) : dataJobs && dataJobs.length > 0 ? (
          dataJobs.map((application) => (
            <CardAplications key={application.id} application={application} idWork={jobId} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <View style={styles.emptyPersonHead} />
              <View style={styles.emptyPersonBody} />
            </View>
            <Text style={styles.emptyTitle}>
              Aún no hay postulantes
            </Text>
            <Text style={styles.emptyMessage}>
              Los trabajadores interesados aparecerán aquí
            </Text>
          </View>
        )}

        {/* Espacio al final */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#0D111B',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 8,
    top: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D111B',
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  introSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D111B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  applicantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  personIconLarge: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  personHeadLarge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#9CA3AF',
    position: 'absolute',
    top: 0,
    left: 12,
  },
  personBodyLarge: {
    width: 28,
    height: 22,
    backgroundColor: '#9CA3AF',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    position: 'absolute',
    bottom: 0,
    left: 6,
  },
  headerInfo: {
    flex: 1,
    gap: 8,
  },
  applicantName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0D111B',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F4C542',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D111B',
  },
  reviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  messageContainer: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 3,
    borderLeftColor: '#1142d4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 15,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  profileButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D111B',
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#1142d4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    position: 'relative',
    marginBottom: 24,
    opacity: 0.3,
  },
  emptyPersonHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9CA3AF',
    position: 'absolute',
    top: 0,
    left: 24,
  },
  emptyPersonBody: {
    width: 56,
    height: 44,
    backgroundColor: '#9CA3AF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'absolute',
    bottom: 0,
    left: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D111B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default PostuladosScreen;