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
import { router } from 'expo-router';

// Tipos para las postulaciones
type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  jobImage: string;
  appliedDate: string;
  salary: number;
  status: ApplicationStatus;
  employerName?: string;
  workStatus?: string;
  rating?: number;
  rejectionReason?: string;
}

// Hook simulado - reemplazar con tu hook real
const useGetMyApplications = () => {
  // Datos de ejemplo - reemplazar con tu API call real
  const mockData: Application[] = [
    {
      _id: '1',
      jobId: 'job1',
      jobTitle: 'Pintura de fachada',
      jobImage: 'https://res.cloudinary.com/dcwgnl9ud/image/upload/v1770148756/changaya_profiles/ol4jdkddpsfnzqdo8zxi.jpg',
      appliedDate: '2023-10-12T10:00:00Z',
      salary: 15000,
      status: 'pending',
      workStatus: 'Ofreciste: Rodillo y pintura propia',
    },
    {
      _id: '2',
      jobId: 'job2',
      jobTitle: 'Reparación de cañería',
      jobImage: 'https://example.com/plumbing.jpg',
      appliedDate: '2023-10-10T14:30:00Z',
      salary: 8500,
      status: 'accepted',
      workStatus: 'Listos para comenzar',
      employerName: 'Juan Pérez',
    },
    {
      _id: '3',
      jobId: 'job3',
      jobTitle: 'Limpieza de jardín',
      jobImage: 'https://example.com/garden.jpg',
      appliedDate: '2023-10-08T09:00:00Z',
      salary: 12000,
      status: 'rejected',
      rejectionReason: 'Cerrado por el solicitante',
    },
    {
      _id: '4',
      jobId: 'job4',
      jobTitle: 'Armado de mueble',
      jobImage: 'https://example.com/furniture.jpg',
      appliedDate: '2023-10-05T16:00:00Z',
      salary: 5000,
      status: 'completed',
      rating: 5.0,
    },
  ];

  return {
    data: mockData,
    isLoading: false,
    error: null,
  };
};

const MisPostulacionesScreen = () => {
  const [activeTab, setActiveTab] = useState<'all' | ApplicationStatus>('all');
  
  // Hook para obtener las postulaciones
  const { data: applications, isLoading, error } = useGetMyApplications();

  // Filtrar postulaciones según el tab activo
  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter((app) => app.status === activeTab);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    return `${day} ${month}`;
  };

  // Formatear salario
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'PENDIENTE',
          bgColor: '#FEF3C7',
          textColor: '#92400E',
        };
      case 'accepted':
        return {
          label: 'ACEPTADA',
          bgColor: '#D1FAE5',
          textColor: '#065F46',
        };
      case 'rejected':
        return {
          label: 'RECHAZADA',
          bgColor: '#FEE2E2',
          textColor: '#991B1B',
        };
      case 'completed':
        return {
          label: 'FINALIZADA',
          bgColor: '#E5E7EB',
          textColor: '#374151',
        };
    }
  };

  const getTabLabel = (tab: 'all' | ApplicationStatus) => {
    switch (tab) {
      case 'all':
        return 'Todas';
      case 'pending':
        return 'Pendientes';
      case 'accepted':
        return 'Aceptadas';
      case 'rejected':
        return 'Rechazadas';
      case 'completed':
        return 'Completadas';
    }
  };

  const getActionButton = (application: Application) => {
    switch (application.status) {
      case 'pending':
        return {
          text: 'Ver detalle',
          style: styles.detailButton,
          textStyle: styles.detailButtonText,
        };
      case 'accepted':
        return {
          text: 'Contactar',
          style: styles.contactButton,
          textStyle: styles.contactButtonText,
        };
      case 'rejected':
        return {
          text: 'Ver motivo',
          style: styles.detailButton,
          textStyle: styles.detailButtonText,
        };
      case 'completed':
        return {
          text: 'Ver Reseña',
          style: styles.detailButton,
          textStyle: styles.detailButtonText,
        };
    }
  };

  const renderApplicationCard = (application: Application) => {
    const statusConfig = getStatusConfig(application.status);
    const actionButton = getActionButton(application);

    return (
      <View key={application._id} style={styles.applicationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.dateText}>
              {formatDate(application.appliedDate)}
            </Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.salaryText}>
              {formatSalary(application.salary)}
            </Text>
          </View>

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
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardLeft}>
            {/* Título */}
            <Text style={styles.jobTitle} numberOfLines={2}>
              {application.jobTitle}
            </Text>

            {/* Información adicional según estado */}
            {application.status === 'pending' && application.workStatus && (
              <Text style={styles.statusInfo} numberOfLines={2}>
                {application.workStatus}
              </Text>
            )}

            {application.status === 'accepted' && application.workStatus && (
              <Text style={styles.acceptedInfo} numberOfLines={1}>
                Estado: {application.workStatus}
              </Text>
            )}

            {application.status === 'rejected' && application.rejectionReason && (
              <Text style={styles.rejectedInfo} numberOfLines={2}>
                {application.rejectionReason}
              </Text>
            )}

            {application.status === 'completed' && application.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Calificación recibida:</Text>
                <View style={styles.ratingStars}>
                  <View style={styles.starIconSmall} />
                  <Text style={styles.ratingValue}>{application.rating.toFixed(1)}</Text>
                </View>
              </View>
            )}

            {/* Botón de acción */}
            <TouchableOpacity
              style={actionButton.style}
              onPress={() => {
                // router.push(`/application-details/${application._id}`);
              }}
            >
              <Text style={actionButton.textStyle}>{actionButton.text}</Text>
            </TouchableOpacity>
          </View>

          {/* Imagen */}
          <View style={styles.cardRight}>
            {application.jobImage ? (
              <Image
                source={{ uri: application.jobImage }}
                style={styles.jobImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.jobImage, styles.placeholderImage]}>
                <View style={styles.imageIcon}>
                  <View style={styles.imageIconBody} />
                </View>
              </View>
            )}
          </View>
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
          <Text style={styles.loadingText}>Cargando postulaciones...</Text>
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
          <Text style={styles.errorTitle}>Error al cargar las postulaciones</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Ocurrió un error inesperado'}
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

        <Text style={styles.headerTitle}>Mis Postulaciones</Text>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => {}}
        >
          <View style={styles.bellIcon}>
            <View style={styles.bellBody} />
            <View style={styles.bellClapper} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
              ]}
            >
              {getTabLabel('all')}
            </Text>
            {activeTab === 'all' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.activeTabText,
              ]}
            >
              {getTabLabel('pending')}
            </Text>
            {activeTab === 'pending' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
            onPress={() => setActiveTab('accepted')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'accepted' && styles.activeTabText,
              ]}
            >
              {getTabLabel('accepted')}
            </Text>
            {activeTab === 'accepted' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de postulaciones */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) =>
            renderApplicationCard(application)
          )
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <View style={styles.emptyDocBody} />
            </View>
            <Text style={styles.emptyTitle}>
              No tienes postulaciones {activeTab !== 'all' && getTabLabel(activeTab).toLowerCase()}
            </Text>
            <Text style={styles.emptyMessage}>
              Explora trabajos disponibles y postúlate
            </Text>
          </View>
        )}

        {/* Espacio al final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/HomeScreen')}
        >
          <View style={styles.homeIcon}>
            <View style={styles.homeBody} />
            <View style={styles.homeRoof} />
          </View>
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {}}
        >
          <View style={styles.searchIcon}>
            <View style={styles.searchCircle} />
            <View style={styles.searchHandle} />
          </View>
          <Text style={styles.navText}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.documentIcon}>
            <View style={styles.documentBody} />
            <View style={styles.documentLine1} />
            <View style={styles.documentLine2} />
          </View>
          <Text style={[styles.navText, styles.navTextActive]}>Mis Postus</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {}}
        >
          <View style={styles.chatIcon}>
            <View style={styles.chatBubble} />
          </View>
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => {}}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#0D111B',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    left: 8,
    top: 7,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D111B',
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  bellBody: {
    width: 18,
    height: 16,
    borderWidth: 2.5,
    borderColor: '#0D111B',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
    position: 'absolute',
    top: 3,
    left: 3,
  },
  bellClapper: {
    width: 4,
    height: 6,
    backgroundColor: '#0D111B',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 10,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    paddingVertical: 16,
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1142d4',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1142d4',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  dotSeparator: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '700',
  },
  salaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D111B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  cardLeft: {
    flex: 1,
    gap: 8,
  },
  cardRight: {
    width: 100,
    height: 100,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D111B',
    lineHeight: 24,
  },
  statusInfo: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  acceptedInfo: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  rejectedInfo: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIconSmall: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F4C542',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D111B',
  },
  detailButton: {
    backgroundColor: '#E8EAED',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  detailButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D111B',
  },
  contactButton: {
    backgroundColor: '#1142d4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  jobImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  imageIconBody: {
    width: 36,
    height: 30,
    borderWidth: 3,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    position: 'absolute',
    top: 5,
    left: 2,
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
    color: '#6B7280',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#1142d4',
    fontWeight: '700',
  },
  homeIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  homeBody: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#6B7280',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 2,
    left: 3,
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#6B7280',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  searchCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6B7280',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  searchHandle: {
    width: 8,
    height: 2,
    backgroundColor: '#6B7280',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 2,
    right: 2,
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
    borderColor: '#6B7280',
    borderRadius: 8,
    position: 'absolute',
    top: 5,
    left: 3,
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
    borderColor: '#6B7280',
    position: 'absolute',
    top: 2,
    left: 8,
  },
  profileBody: {
    width: 14,
    height: 10,
    borderWidth: 2,
    borderColor: '#6B7280',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    bottom: 2,
    left: 5,
  },
});

export default MisPostulacionesScreen;