import { useSelectApplicantForWork, useGetUserById } from '@/hooks/useWork';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const CardAplications = ({ application, idWork }: { application: { id: string; status: string; createdAt: string; updatedAt: string; worker: { id: string; fullName: string; email?: string; imageProfile?: string, description?: string } }, idWork: string }) => {
  const worker = application.worker || { id: '', fullName: 'Usuario', imageProfile: undefined };

  // Hook para seleccionar un trabajador para un trabajo
  const { mutate: selectApplicantForWork } = useSelectApplicantForWork();
  
  // Hook para obtener datos completos del perfil del trabajador
  const { data: userProfileData, isLoading: loadingProfile } = useGetUserById(worker.id);
  const fullProfile = userProfileData?.data || worker;


  const handleSelectApplicant = (workerId: string) => {
    selectApplicantForWork({ workId: idWork, workerId: workerId, applicationId: application.id });
  }

  return (
    <View key={application.id} style={styles.applicantCard}>
      {/* Avatar y nombre */}
      <View style={styles.cardHeader}>
        {worker.imageProfile ? (
          <Image
            source={{ uri: worker.imageProfile }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <View style={styles.personIconLarge}>
              <View style={styles.personHeadLarge} />
              <View style={styles.personBodyLarge} />
            </View>
          </View>
        )}

        <View style={styles.headerInfo}>
          <Text style={styles.applicantName}>{worker.fullName}</Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.reviewsText}>{application.status}</Text>
          </View>
        </View>
      </View>

      {/* Descripción del perfil */}
      {loadingProfile ? (
        <View style={styles.descriptionContainer}>
          <ActivityIndicator size="small" color="#1142d4" />
          <Text style={styles.loadingDescriptionText}>Cargando descripción...</Text>
        </View>
      ) : fullProfile?.description ? (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descripción:</Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {fullProfile.description}
          </Text>
        </View>
      ) : (
        <View style={styles.descriptionContainer}>
          <Text style={styles.noDescriptionText}>Sin descripción disponible</Text>
        </View>
      )}

      {/* Fecha de postulación */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Postulado: {application.createdAt ? new Date(application.createdAt).toLocaleString('es-AR') : ''}
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            // Navegar al perfil completo del trabajador
            router.push({
              pathname: '/(tabs)/Workerprofilescreen',
              params: {
                userId: worker.id,
                userName: worker.fullName,
              }
            });
          }}
        >
          <Text style={styles.profileButtonText}>Ver Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            handleSelectApplicant(worker.id);
          }}
        >
          <Text style={styles.selectButtonText}>Seleccionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  descriptionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  noDescriptionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingDescriptionText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
  },
});

export default CardAplications