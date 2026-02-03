import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import WorkCard from './WorkCard';

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

interface WorkOpportunitiesListProps {
  works: Work[];
  isLoading: boolean;
  error: any;
}

const WorkOpportunitiesList: React.FC<WorkOpportunitiesListProps> = ({ 
  works, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1142d4" />
        <Text style={styles.loadingText}>Cargando oportunidades...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIcon}>
          <View style={styles.errorCircle} />
          <View style={styles.errorMark}>
            <View style={styles.errorLine1} />
            <View style={styles.errorLine2} />
          </View>
        </View>
        <Text style={styles.errorTitle}>Error al cargar</Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'No se pudieron cargar las oportunidades. Intenta nuevamente.'}
        </Text>
      </View>
    );
  }

  if (!works || works.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <View style={styles.emptyDocBody} />
          <View style={styles.emptyDocLine1} />
          <View style={styles.emptyDocLine2} />
          <View style={styles.emptyDocLine3} />
        </View>
        <Text style={styles.emptyTitle}>
          No hay oportunidades disponibles
        </Text>
        <Text style={styles.emptyMessage}>
          Vuelve pronto para ver nuevas changas publicadas.{'\n'}
          Aquí aparecerán todas las oportunidades de trabajo.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {works.map((work) => {
        const workId = work.id || work._id;
        return <WorkCard key={workId} work={work} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorIcon: {
    width: 70,
    height: 70,
    position: 'relative',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#EF4444',
    position: 'absolute',
  },
  errorMark: {
    width: 32,
    height: 32,
    position: 'relative',
  },
  errorLine1: {
    width: 24,
    height: 4,
    backgroundColor: '#EF4444',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 14,
    left: 4,
  },
  errorLine2: {
    width: 24,
    height: 4,
    backgroundColor: '#EF4444',
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    top: 14,
    left: 4,
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
    lineHeight: 20,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 90,
    height: 90,
    position: 'relative',
    marginBottom: 24,
    opacity: 0.3,
  },
  emptyDocBody: {
    width: 64,
    height: 76,
    borderWidth: 3,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    position: 'absolute',
    top: 7,
    left: 13,
  },
  emptyDocLine1: {
    width: 44,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    position: 'absolute',
    top: 24,
    left: 23,
  },
  emptyDocLine2: {
    width: 36,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    position: 'absolute',
    top: 34,
    left: 23,
  },
  emptyDocLine3: {
    width: 40,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    position: 'absolute',
    top: 44,
    left: 23,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D111B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default WorkOpportunitiesList;