import { useAplyToWork } from '@/hooks/useAplyToWork';
import { useWorkDetails } from '@/hooks/useWork';
import { useAuthSessionStore } from '@/store/authSessionStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface IWorkData {
  workerId: string;
  workId: string;

}

const { width } = Dimensions.get('window');

const WorkDetailScreen = ({ route }: any) => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const id = route?.params?.id ?? (searchParams?.id as string);
  
  if (!id) {
    console.warn('WorkDetailScreen: missing id param');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>No se encontró el ID del trabajo.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { data: workDetails, isLoading, isError } = useWorkDetails(id);

  //hook para postularme al trabajo
  const {applyToWorkMutation }= useAplyToWork();
  const { mutate: applyToWork, isPending } = applyToWorkMutation;
  const { user } = useAuthSessionStore();


  //handler para postularse
  const handleApplyToWork = () => {
   

    const data:IWorkData = {
      workerId: '',
      workId: id,
    };

    applyToWork(data, {
      onSuccess: (response: any) => {
        Alert.alert('Éxito', response?.message || 'Postulación enviada correctamente');
      },
      onError: (err: any) => {
        // intentamos mapear varios posibles shapes de error
        const message = err?.response?.data?.error || err?.response?.data?.message || (typeof err === 'string' ? err : err?.message) || 'Error al postularse al trabajo';
        Alert.alert('Error', message);
      }
    });
  }

  // Manejo de estados de carga y error
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !workDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>No se pudo cargar el trabajo</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  console.log('Detalles del trabajo:', workDetails);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Publicado hoy';
    if (diffDays === 1) return 'Publicado hace 1 día';
    if (diffDays < 7) return `Publicado hace ${diffDays} días`;
    if (diffDays < 30) return `Publicado hace ${Math.floor(diffDays / 7)} semanas`;
    return `Publicado hace ${Math.floor(diffDays / 30)} meses`;
  };

  // Función para formatear el salario
  const formatSalary = (salary: number) => {
    return `$${salary.toLocaleString('es-AR')} ARS`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header fijo */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Trabajo</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Contenido con scroll */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Info del publicador - Ahora arriba */}
        <View style={styles.publisherHeader}>
          <Image
            source={{ 
              uri: workDetails.imageProfileUser || 'https://randomuser.me/api/portraits/lego/1.jpg' 
            }}
            style={styles.avatarSmall}
          />
          <View style={styles.publisherHeaderInfo}>
            <Text style={styles.publisherNameSmall}>
              {workDetails.fullNameUser || 'Usuario'}
            </Text>
            <Text style={styles.publishedDateSmall}>
              {formatDate(workDetails.createdAt)}
            </Text>
          </View>
          {/* Estado del trabajo */}
          <View style={[
            styles.statusBadge,
            { backgroundColor: workDetails.workIsActive ? '#D1FAE5' : '#FEE2E2' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: workDetails.workIsActive ? '#059669' : '#DC2626' }
            ]}>
              {workDetails.workIsActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        {/* Título del trabajo */}
        <Text style={styles.jobTitle}>{workDetails.title}</Text>

        {/* Info chips */}
        <View style={styles.chipsContainer}>
          {workDetails.location && (
            <View style={styles.chip}>
              <Ionicons name="location-outline" size={18} color="#4F46E5" />
              <Text style={styles.chipText}>{workDetails.location}</Text>
            </View>
          )}

          {workDetails.salary && (
            <View style={styles.chip}>
              <MaterialIcons name="attach-money" size={18} color="#4F46E5" />
              <Text style={styles.chipText}>{formatSalary(workDetails.salary)}</Text>
            </View>
          )}
        </View>

        {/* Estado de apertura */}
        {workDetails.worksIsOpen && (
          <View style={styles.chipsContainer}>
            <View style={[
              styles.chip,
              { 
                backgroundColor: workDetails.worksIsOpen === 'open' ? '#DBEAFE' : '#FEE2E2',
                borderWidth: 1,
                borderColor: workDetails.worksIsOpen === 'open' ? '#93C5FD' : '#FECACA',
              }
            ]}>
              <Ionicons 
                name={workDetails.worksIsOpen === 'open' ? 'checkmark-circle' : 'close-circle'} 
                size={18} 
                color={workDetails.worksIsOpen === 'open' ? '#3B82F6' : '#EF4444'} 
              />
              <Text style={[
                styles.chipText,
                { color: workDetails.worksIsOpen === 'open' ? '#1D4ED8' : '#DC2626' }
              ]}>
                {workDetails.worksIsOpen === 'open' ? 'Abierto a postulaciones' : 'Cerrado'}
              </Text>
            </View>
          </View>
        )}

        {/* Imágenes del trabajo */}
        {workDetails.imageWork && workDetails.imageWork.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Imágenes del Proyecto</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imagesScroll}
              contentContainerStyle={styles.imagesScrollContent}
            >
              {workDetails.imageWork.map((imageUrl: string, index: number) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.workImage}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>
              {workDetails.description || 'No hay descripción disponible'}
            </Text>
          </View>
        </View>

        {/* Requisitos */}
        {workDetails.requirements && workDetails.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requisitos</Text>
            <View style={styles.requirementsContainer}>
              {workDetails.requirements.map((requirement: string, index: number) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={styles.requirementBullet}>
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  </View>
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Información de Contacto - ELIMINADA */}

        {/* Espaciado inferior calculado: 80px (BottomTabBar) + 70px (botón) + margen */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón flotante - posicionado arriba del BottomTabBar */}
      {workDetails.workIsActive && workDetails.worksIsOpen === 'open' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.sendButton}
            activeOpacity={0.8}
            onPress={handleApplyToWork}
          >
            <Ionicons name="send" size={20} color="#FFF" />
            <Text style={styles.buttonText}>{isPending ? 'Postulando...' : 'Postularme'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  publisherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  publisherHeaderInfo: {
    flex: 1,
  },
  publisherNameSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  publishedDateSmall: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '400',
  },
  imagesScroll: {
    marginHorizontal: -20,
  },
  imagesScrollContent: {
    paddingHorizontal: 20,
  },
  imageWrapper: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workImage: {
    width: 280,
    height: 180,
    borderRadius: 12,
  },
  requirementsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 14,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  requirementBullet: {
    marginRight: 10,
    marginTop: 1,
  },
  requirementText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '400',
  },
  bottomSpacer: {
    height: 170,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 78, 
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent', 
  },
  sendButton: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});

export default WorkDetailScreen;