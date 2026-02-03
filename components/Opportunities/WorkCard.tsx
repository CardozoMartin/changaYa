import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

interface Work {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  imageWork?: string[];
  location?: string;
  salary?: number;
  requirements?: string[] | any[];
  createdAt?: string;
  employerId?: {
    fullName?: string;
    fullNameUser?: string;
    imageProfile?: string;
    imageProfileUser?: string;
  } | string;
  fullName?: string;
  fullNameUser?: string;
  imageProfile?: string;
  imageProfileUser?: string;
}

interface WorkCardProps {
  work: Work;
}

const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const router = useRouter();

  // Obtener el ID del trabajo (maneja tanto _id como id)
  const workId = work.id || work._id;

  // Mapear employer (puede venir como objeto poblado o como id)
  const employer = work.employerId && typeof work.employerId === 'object' ? work.employerId : null;
  
  const employerName = employer?.fullNameUser ?? work.fullNameUser ?? employer?.fullName ?? work.fullName ?? 'Usuario';
  const employerAvatar = employer?.imageProfileUser ?? work.imageProfileUser ?? employer?.imageProfile ?? work.imageProfile ?? null;

  // Formatear tiempo de publicación (más amigable que fecha completa)
  const formatPublishedTime = (createdAt?: string) => {
    if (!createdAt) return 'Recientemente';
    
    const now = new Date();
    const published = new Date(createdAt);
    const diffInMs = now.getTime() - published.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `Hace ${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else if (diffInDays === 1) {
      return 'Hace 1d';
    } else if (diffInDays < 30) {
      return `Hace ${diffInDays}d`;
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `Hace ${diffInMonths}m`;
    }
  };

  // Formatear salario
  const formatSalary = (amount?: number) => {
    if (typeof amount === 'undefined' || amount === null) {
      return 'A convenir';
    }
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Obtener categoría de los requisitos
  const getCategory = () => {
    if (!work.requirements || !Array.isArray(work.requirements) || work.requirements.length === 0) {
      return 'Sin categoría';
    }
    
    const firstReq = work.requirements[0];
    return typeof firstReq === 'string' 
      ? firstReq 
      : (firstReq?.title ?? 'Sin categoría');
  };

  // Obtener iniciales para avatar placeholder
  const getInitials = (name: string = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Renderizar estrellas de calificación
  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>★</Text>
        ))}
      </View>
    );
  };

  // Verificar si el trabajo es nuevo (publicado hace menos de 3 días)
  const isNew = () => {
    if (!work.createdAt) return false;
    
    const publishDate = new Date(work.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  const imageUrl = work.imageWork && work.imageWork.length > 0 
    ? work.imageWork[0] 
    : null;

  const handlePress = () => {
    console.log('Ver detalles del trabajo con ID:', workId);
    // Navegar a la pantalla de detalles con el id
    router.push({ pathname: '/WorkDetailScreen', params: { id: workId } });
  };

  return (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
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

      {/* Badge "NUEVA" - solo si se publicó hace menos de 3 días */}
      {isNew() && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NUEVA</Text>
        </View>
      )}

      {/* Contenido */}
      <View style={styles.jobContent}>
        {/* Header: Título y Salario */}
        <View style={styles.cardHeader}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {work.title || 'Sin título'}
          </Text>
          <Text style={styles.salaryBadge}>
            {formatSalary(work.salary)}
          </Text>
        </View>

        {/* Descripción */}
        <Text style={styles.jobDescription} numberOfLines={2}>
          {work.description || ''}
        </Text>

        {/* Categoría y Ubicación */}
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <View style={styles.tagIconSmall}>
              <View style={styles.tagShapeSmall} />
            </View>
            <Text style={styles.metaText} numberOfLines={1}>
              {getCategory()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <View style={styles.locationIconContainer}>
              <View style={styles.locationPin} />
            </View>
            <Text style={styles.metaText} numberOfLines={1}>
              {work.location || 'Sin ubicación'}
            </Text>
          </View>
        </View>

        {/* Información del empleador */}
        <View style={styles.cardFooter}>
          <View style={styles.employerInfo}>
            {employerAvatar ? (
              <Image
                source={{ uri: employerAvatar }}
                style={styles.employerAvatar}
              />
            ) : (
              <View style={styles.employerAvatarPlaceholder}>
                <Text style={styles.employerInitials}>
                  {getInitials(employerName)}
                </Text>
              </View>
            )}
            <View style={styles.employerDetails}>
              <Text style={styles.employerName} numberOfLines={1}>
                {employerName}
              </Text>
              {renderStars()}
            </View>
          </View>
          <Text style={styles.publishedTime}>
            {formatPublishedTime(work.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  briefcaseIconLarge: {
    width: 50,
    height: 50,
    position: 'relative',
    marginBottom: 10,
  },
  briefcaseHandleLarge: {
    position: 'absolute',
    top: 3,
    left: 15,
    width: 20,
    height: 10,
    borderWidth: 3,
    borderColor: '#9CA3AF',
    borderBottomWidth: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  briefcaseBodyLarge: {
    position: 'absolute',
    top: 12,
    left: 3,
    width: 44,
    height: 34,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#9CA3AF',
    borderRadius: 5,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  jobContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0D111B',
    marginRight: 8,
  },
  salaryBadge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tagIconSmall: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  tagShapeSmall: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: '#6B7280',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  locationIconContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  locationPin: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: '#6B7280',
    borderRadius: 5,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  employerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  employerAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  employerInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  employerDetails: {
    flex: 1,
  },
  employerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D111B',
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    fontSize: 11,
    color: '#FFC107',
  },
  publishedTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default WorkCard;