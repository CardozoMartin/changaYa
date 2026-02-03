import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const WorkOpportunitiesList = ({ works, isLoading, error }) => {
  const router = useRouter();

  // Mapear los datos del backend al formato del diseño (robusto a varias formas de respuesta)
  const mapWorkToOpportunity = (work) => {
    // employer puede venir como objeto poblado o como id
    const employer = work.employerId && typeof work.employerId === 'object' ? work.employerId : null;

    const name = employer?.fullNameUser ?? work.fullNameUser ?? employer?.fullName ?? work.fullName ?? 'Usuario';
    const avatar = employer?.imageProfileUser ?? work.imageProfileUser ?? employer?.imageProfile ?? work.imageProfile ?? null;

    const salary = typeof work.salary !== 'undefined' && work.salary !== null
      ? `S/${Number(work.salary).toLocaleString('es-PE')}`
      : 'S/--';

    const category = Array.isArray(work.requirements) && work.requirements.length > 0
      ? (typeof work.requirements[0] === 'string' ? work.requirements[0] : (work.requirements[0].title ?? 'Sin categoría'))
      : 'Sin categoría';

    return {
      id: work.id,
      title: work.title ?? 'Sin título',
      price: salary,
      description: work.description ?? '',
      category,
      location: work.location ?? '',
      user: {
        name,
        avatar,
        rating: 5,
      },
      publishedTime: formatPublishedTime(work.createdAt),
      imageWork: Array.isArray(work.imageWork) ? work.imageWork : [],
    };
  };

  // Formatear el tiempo de publicación
  const formatPublishedTime = (createdAt) => {
    const now = new Date();
    const published = new Date(createdAt);
    const diffInMs = now - published;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `Publicado hace ${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `Publicado hace ${diffInHours}h`;
    } else {
      return `Publicado hace ${diffInDays}d`;
    }
  };

  //const funcion para obtener el id del trabajo y enviar a la pantalla de detalles
  const handleDetailsWorks = (workId:any) => {
    console.log('Ver detalles del trabajo con ID:', workId);
    // ahora enviamos a la pantalla de detalles con el id
    router.push({ pathname: '/WorkDetailScreen', params: { id: workId } });
  }

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>★</Text>
        ))}
      </View>
    );
  };

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.loadingText}>Cargando oportunidades...</Text>
      </View>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar las oportunidades</Text>
        <Text style={styles.errorDescription}>{error.message}</Text>
      </View>
    );
  }

  // Mostrar mensaje si no hay trabajos
  if (!works || works.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay oportunidades disponibles</Text>
        <Text style={styles.emptyDescription}>
          Vuelve más tarde para ver nuevas oportunidades
        </Text>
      </View>
    );
  }

  // Renderizar las tarjetas de oportunidades
  const opportunities = works.map(mapWorkToOpportunity);

  return (
    <>
      {opportunities.map((opp:any) => (
        <TouchableOpacity 
          key={opp.id}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => handleDetailsWorks(opp.id)}
        >
          {/* Title and Price */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {opp.title}
            </Text>
           
          </View>

          {/* Description */}
          <Text style={styles.cardDescription} numberOfLines={2}>
            {opp.description}
          </Text>

          {/* Category and Location */}
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <View style={styles.tagIconSmall}>
                <View style={styles.tagShapeSmall} />
              </View>
              <Text style={styles.metaText} numberOfLines={1}>
                {opp.category}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <View style={styles.pinIconSmall}>
                <View style={styles.pinShapeSmall} />
              </View>
              <Text style={styles.metaText} numberOfLines={1}>
                {opp.location}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.cardFooter}>
            <View style={styles.userInfoCard}>
              {opp.user.avatar ? (
                <Image 
                  source={{ uri: opp.user.avatar }}
                  style={styles.userAvatar}
                />
              ) : (
                <View style={styles.userAvatarPlaceholder}>
                  <Text style={styles.userAvatarInitials}>{getInitials(opp.user.name)}</Text>
                </View>
              )}

              <View>
                <Text style={styles.userName}>{opp.user.name}</Text>
                {renderStars(opp.user.rating)}
              </View>
            </View>
            <Text style={styles.publishedTime}>{opp.publishedTime}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginRight: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  cardDescription: {
    fontSize: 13,
    color: '#5A6C7D',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tagIconSmall: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  tagShapeSmall: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#5A6C7D',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 2,
    left: 2,
  },
  pinIconSmall: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  pinShapeSmall: {
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderColor: '#5A6C7D',
    borderRadius: 4,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 1,
    left: 3,
  },
  metaText: {
    fontSize: 12,
    color: '#5A6C7D',
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 2,
  },
  star: {
    fontSize: 10,
    color: '#FFC107',
  },
  publishedTime: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5A6C7D',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 13,
    color: '#5A6C7D',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#5A6C7D',
    textAlign: 'center',
  },
});

export default WorkOpportunitiesList;