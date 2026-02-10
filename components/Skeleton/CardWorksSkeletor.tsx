import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'

export default function CardWorksSkeletor() {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
         Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
    }, [])

    const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ style }: { style?: any }) => (
    <Animated.View style={[styles.skeleton, { opacity }, style]} />
  );
  return (
    <View style={styles.jobCard}>
      {/* Imagen skeleton */}
      <SkeletonBox style={styles.jobImage} />

      {/* Contenido */}
      <View style={styles.jobContent}>
        {/* Header: Título y Salario */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <SkeletonBox style={styles.titleSkeleton} />
            <SkeletonBox style={[styles.titleSkeleton, { width: '70%', marginTop: 6 }]} />
          </View>
          <SkeletonBox style={styles.salarySkeleton} />
        </View>

        {/* Descripción */}
        <View style={{ marginBottom: 12 }}>
          <SkeletonBox style={styles.descriptionSkeleton} />
          <SkeletonBox style={[styles.descriptionSkeleton, { width: '80%', marginTop: 6 }]} />
        </View>

        {/* Categoría y Ubicación */}
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <SkeletonBox style={styles.iconSkeleton} />
            <SkeletonBox style={styles.metaTextSkeleton} />
          </View>
          <View style={styles.metaItem}>
            <SkeletonBox style={styles.iconSkeleton} />
            <SkeletonBox style={styles.metaTextSkeleton} />
          </View>
        </View>

        {/* Footer: Empleador */}
        <View style={styles.cardFooter}>
          <View style={styles.employerInfo}>
            <SkeletonBox style={styles.avatarSkeleton} />
            <View style={{ flex: 1 }}>
              <SkeletonBox style={styles.employerNameSkeleton} />
              <SkeletonBox style={styles.starsSkeleton} />
            </View>
          </View>
          <SkeletonBox style={styles.timeSkeleton} />
        </View>
      </View>
    </View>
  )
}
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
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
  titleSkeleton: {
    height: 20,
    width: '100%',
  },
  salarySkeleton: {
    height: 20,
    width: 80,
  },
  descriptionSkeleton: {
    height: 16,
    width: '100%',
  },
  iconSkeleton: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  metaTextSkeleton: {
    height: 14,
    flex: 1,
  },
  avatarSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  employerNameSkeleton: {
    height: 14,
    width: 100,
    marginBottom: 4,
  },
  starsSkeleton: {
    height: 12,
    width: 60,
  },
  timeSkeleton: {
    height: 12,
    width: 50,
  },
});

