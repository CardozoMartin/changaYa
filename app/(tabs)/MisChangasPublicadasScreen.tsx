import { useGetProfileData } from '@/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Tipos para las changas basados en tu backend
type JobStatus = 'open' | 'in_progress' | 'closed';

interface Job {
  _id: string;
  title: string;
  description: string;
  worksIsOpen: JobStatus;
  imageWork: string[];
  createdAt: string;
  location: string;
  salary: number;
  requirements: string[];
  workIsActive: boolean;
  employerId: string;
  idUser: string;
  updatedAt: string;
  __v: number;
}

const MisChangasPublicadasScreen = () => {
  const [activeTab, setActiveTab] = useState<JobStatus>('open');
  
  // Hook para obtener las changas publicadas
  const { data: profileData, isLoading, error } = useGetProfileData();
  const dataUser: Job[] = profileData?.data?.works ?? [];

  console.log('Data del usuario en MisChangasPublicadasScreen:', dataUser);

  // Filtrar trabajos según el tab activo
  const filteredJobs = dataUser.filter((job) => job.worksIsOpen === activeTab);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Formatear salario
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case 'open':
        return {
          label: 'ABIERTA',
          bgColor: '#E8F5E9',
          textColor: '#2E7D32',
        };
      case 'in_progress':
        return {
          label: 'EN PROGRESO',
          bgColor: '#E3F2FD',
          textColor: '#1565C0',
        };
      case 'closed':
        return {
          label: 'FINALIZADA',
          bgColor: '#F5F5F5',
          textColor: '#616161',
        };
    }
  };

  const getTabLabel = (status: JobStatus) => {
    switch (status) {
      case 'open':
        return 'Abiertas';
      case 'in_progress':
        return 'En progreso';
      case 'closed':
        return 'Finalizadas';
    }
  };

  const renderJobCard = (job: Job) => {
    const statusConfig = getStatusConfig(job.worksIsOpen);
    const imageUrl = job.imageWork && job.imageWork.length > 0 
      ? job.imageWork[0] 
      : null;

    return (
      <View key={job._id} style={styles.jobCard}>
        {/* Imagen */}
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.jobImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.jobImage, styles.placeholderImage]}>
            <View style={styles.briefcaseIconLarge}>
              <View style={styles.briefcaseHandleLarge} />
              <View style={styles.briefcaseBodyLarge} />
            </View>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        {/* Contenido */}
        <View style={styles.jobContent}>
          {/* Badge de estado */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.bgColor },
            ]}
          >
            <Text
              style={[styles.statusText, { color: statusConfig.textColor }]}
            >
              {statusConfig.label}
            </Text>
          </View>

          {/* Título */}
          <Text style={styles.jobTitle} numberOfLines={2}>
            {job.title}
          </Text>

          {/* Descripción */}
          <Text style={styles.jobDescription} numberOfLines={3}>
            {job.description}
          </Text>

          {/* Info adicional */}
          <View style={styles.jobInfo}>
            {/* Fecha de publicación */}
            <View style={styles.infoRow}>
              <View style={styles.calendarIcon}>
                <View style={styles.calendarTop} />
                <View style={styles.calendarBody} />
              </View>
              <Text style={styles.infoText}>
                Publicado: {formatDate(job.createdAt)}
              </Text>
            </View>

            {/* Ubicación */}
            <View style={styles.infoRow}>
              <View style={styles.locationIconContainer}>
                <View style={styles.locationPin} />
              </View>
              <Text style={styles.infoText} numberOfLines={1}>
                {job.location}
              </Text>
            </View>

            {/* Salario */}
            <View style={styles.infoRow}>
              <View style={styles.moneyIconContainer}>
                <View style={styles.moneyCircle} />
                <View style={styles.moneyLine} />
              </View>
              <Text style={styles.salaryText}>
                {formatSalary(job.salary)}
              </Text>
            </View>

            {/* Información específica según estado */}
            {job.worksIsOpen === 'open' && (
              <View style={styles.infoRow}>
                <View style={styles.peopleIcon}>
                  <View style={styles.personIconSmall} />
                  <View style={styles.personIconSmall} />
                </View>
                <Text style={styles.infoText}>
                  Esperando postulantes
                </Text>
              </View>
            )}

            {job.worksIsOpen === 'in_progress' && (
              <View style={styles.infoRow}>
                <View style={styles.personIconContainer}>
                  <View style={styles.personHead} />
                  <View style={styles.personBody} />
                </View>
                <Text style={styles.infoText}>Trabajo en curso</Text>
              </View>
            )}

            {job.worksIsOpen === 'closed' && (
              <View style={styles.infoRow}>
                <View style={styles.checkIconContainer}>
                  <View style={styles.checkMark} />
                </View>
                <Text style={styles.completedText}>
                  Trabajo completado
                </Text>
              </View>
            )}
          </View>

          {/* Requisitos (chips) */}
          {job.requirements && job.requirements.length > 0 && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsLabel}>Requisitos:</Text>
              <View style={styles.chipContainer}>
                {job.requirements.slice(0, 3).map((req, index) => (
                  <View key={index} style={styles.requirementChip}>
                    <Text style={styles.requirementText} numberOfLines={1}>
                      {req}
                    </Text>
                  </View>
                ))}
                {job.requirements.length > 3 && (
                  <View style={styles.requirementChip}>
                    <Text style={styles.requirementText}>
                      +{job.requirements.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Botón de acción */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              job.worksIsOpen === 'closed' && styles.actionButtonSecondary,
            ]}
            onPress={() => {
              console.log('Ver detalles de:', job._id);
              // router.push(`/job-details/${job._id}`);
            }}
          >
            <Text 
              style={[
                styles.actionButtonText,
                job.worksIsOpen === 'closed' && styles.actionButtonTextSecondary
              ]}
            >
              {job.worksIsOpen === 'open' && 'Ver postulantes'}
              {job.worksIsOpen === 'in_progress' && 'Gestionar trabajo'}
              {job.worksIsOpen === 'closed' && 'Re-publicar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1142d4" />
          <Text style={styles.loadingText}>Cargando changas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error al cargar las changas</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Ocurrió un error inesperado'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Mis Changas Publicadas</Text>
        <View style={styles.spacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'open' && styles.activeTab]}
          onPress={() => setActiveTab('open')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'open' && styles.activeTabText,
            ]}
          >
            {getTabLabel('open')}
          </Text>
          {activeTab === 'open' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'in_progress' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('in_progress')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'in_progress' && styles.activeTabText,
            ]}
          >
            {getTabLabel('in_progress')}
          </Text>
          {activeTab === 'in_progress' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'closed' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('closed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'closed' && styles.activeTabText,
            ]}
          >
            {getTabLabel('closed')}
          </Text>
          {activeTab === 'closed' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Lista de trabajos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => renderJobCard(job))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <View style={styles.emptyDocBody} />
              <View style={styles.emptyDocLine1} />
              <View style={styles.emptyDocLine2} />
            </View>
            <Text style={styles.emptyTitle}>
              No hay changas {getTabLabel(activeTab).toLowerCase()}
            </Text>
            <Text style={styles.emptyMessage}>
              {activeTab === 'open' && 'Publica una nueva changa para empezar'}
              {activeTab === 'in_progress' && 'Aquí aparecerán los trabajos en curso'}
              {activeTab === 'closed' && 'Los trabajos finalizados aparecerán aquí'}
            </Text>
          </View>
        )}

        {/* Espacio al final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón flotante para nueva changa */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          console.log('Crear nueva changa');
          // router.push('/create-job');
        }}
      >
        <View style={styles.plusIcon}>
          <View style={styles.plusLine1} />
          <View style={styles.plusLine2} />
        </View>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/HomeScreen')}
        >
          <View style={styles.exploreIcon}>
            <View style={styles.compassCircle} />
            <View style={styles.compassNeedle} />
          </View>
          <Text style={styles.navText}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.documentIcon}>
            <View style={styles.documentBody} />
            <View style={styles.documentLine1} />
            <View style={styles.documentLine2} />
          </View>
          <Text style={[styles.navText, styles.navTextActive]}>
            Mis Changas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Ir a Chats')}
        >
          <View style={styles.chatIcon}>
            <View style={styles.chatBubble} />
            <View style={styles.chatDots} />
          </View>
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Ir a Perfil')}
        >
          <View style={styles.profileIcon}>
            <View style={styles.profileHead} />
            <View style={styles.profileBody} />
          </View>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  retryButton: {
    marginTop: 16,
    backgroundColor: '#1142d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#0D111B',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 8,
    top: 7,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D111B',
  },
  spacer: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8A8A8A',
  },
  activeTabText: {
    color: '#1142d4',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1142d4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  jobImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  briefcaseIconLarge: {
    width: 60,
    height: 60,
    position: 'relative',
    marginBottom: 12,
  },
  briefcaseHandleLarge: {
    position: 'absolute',
    top: 4,
    left: 18,
    width: 24,
    height: 12,
    borderWidth: 4,
    borderColor: '#9CA3AF',
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  briefcaseBodyLarge: {
    position: 'absolute',
    top: 14,
    left: 4,
    width: 52,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#9CA3AF',
    borderRadius: 6,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  jobContent: {
    padding: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D111B',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobInfo: {
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIcon: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  calendarTop: {
    width: 14,
    height: 3,
    backgroundColor: '#1142d4',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    position: 'absolute',
    top: 0,
  },
  calendarBody: {
    width: 14,
    height: 12,
    borderWidth: 1.5,
    borderColor: '#1142d4',
    borderRadius: 2,
    position: 'absolute',
    top: 2,
  },
  locationIconContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPin: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#1142d4',
    borderRadius: 6,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  moneyIconContainer: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  moneyCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#10B981',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  moneyLine: {
    width: 8,
    height: 2,
    backgroundColor: '#10B981',
    position: 'absolute',
    top: 7,
    left: 4,
  },
  peopleIcon: {
    width: 20,
    height: 16,
    flexDirection: 'row',
    gap: 2,
  },
  personIconSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1142d4',
  },
  personIconContainer: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  personHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1142d4',
    position: 'absolute',
    top: 0,
    left: 5,
  },
  personBody: {
    width: 10,
    height: 8,
    borderWidth: 1.5,
    borderColor: '#1142d4',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: 3,
  },
  checkIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  salaryText: {
    fontSize: 15,
    color: '#10B981',
    fontWeight: '700',
  },
  completedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  requirementsContainer: {
    marginBottom: 16,
  },
  requirementsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  requirementChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  requirementText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#1142d4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1142d4',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    color: '#1142d4',
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
  emptyDocBody: {
    width: 60,
    height: 70,
    borderWidth: 3,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    position: 'absolute',
    top: 5,
    left: 10,
  },
  emptyDocLine1: {
    width: 40,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    position: 'absolute',
    top: 25,
    left: 20,
  },
  emptyDocLine2: {
    width: 30,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    position: 'absolute',
    top: 35,
    left: 20,
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
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1142d4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1142d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  plusIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  plusLine1: {
    width: 20,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'absolute',
    top: 10,
    left: 2,
  },
  plusLine2: {
    width: 3,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'absolute',
    top: 2,
    left: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 8,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#1142d4',
    fontWeight: '600',
  },
  exploreIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  compassCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8A8A8A',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  compassNeedle: {
    width: 8,
    height: 8,
    backgroundColor: '#8A8A8A',
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  documentIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  documentBody: {
    width: 16,
    height: 20,
    borderWidth: 2,
    borderColor: '#1142d4',
    borderRadius: 2,
    position: 'absolute',
    top: 2,
    left: 4,
  },
  documentLine1: {
    width: 8,
    height: 2,
    backgroundColor: '#1142d4',
    position: 'absolute',
    top: 8,
    left: 8,
  },
  documentLine2: {
    width: 8,
    height: 2,
    backgroundColor: '#1142d4',
    position: 'absolute',
    top: 12,
    left: 8,
  },
  chatIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  chatBubble: {
    width: 18,
    height: 14,
    borderWidth: 2,
    borderColor: '#8A8A8A',
    borderRadius: 8,
    position: 'absolute',
    top: 4,
    left: 3,
  },
  chatDots: {
    width: 10,
    height: 2,
    backgroundColor: '#8A8A8A',
    borderRadius: 1,
    position: 'absolute',
    top: 10,
    left: 7,
  },
  profileIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  profileHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8A8A8A',
    position: 'absolute',
    top: 2,
    left: 8,
  },
  profileBody: {
    width: 14,
    height: 10,
    borderWidth: 2,
    borderColor: '#8A8A8A',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    bottom: 2,
    left: 5,
  },
});

export default MisChangasPublicadasScreen;