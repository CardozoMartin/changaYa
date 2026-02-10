import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Easing,
} from "react-native";

const ProfileSkeleton = () => {
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
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ style }: { style?: any }) => (
    <Animated.View style={[styles.skeleton, { opacity }, style]} />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBox style={styles.headerTitleSkeleton} />
        <View style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#fff" />
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <SkeletonBox style={styles.avatarSkeleton} />
          <View style={styles.editButton}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </View>
        <SkeletonBox style={styles.userNameSkeleton} />
        <SkeletonBox style={styles.locationSkeleton} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star" size={24} color="#1E3A8A" />
          </View>
          <SkeletonBox style={styles.statNumberSkeleton} />
          <SkeletonBox style={styles.statLabelSkeleton} />
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#DBEAFE" }]}
          >
            <Ionicons name="briefcase" size={24} color="#1E3A8A" />
          </View>
          <SkeletonBox style={styles.statNumberSkeleton} />
          <SkeletonBox style={styles.statLabelSkeleton} />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <SkeletonBox style={styles.sectionTitleSkeleton} />
        <View style={styles.aboutCard}>
          <SkeletonBox style={styles.aboutTextSkeleton} />
          <SkeletonBox style={[styles.aboutTextSkeleton, { width: '90%', marginTop: 8 }]} />
          <SkeletonBox style={[styles.aboutTextSkeleton, { width: '70%', marginTop: 8 }]} />
        </View>
      </View>

      {/* Publications Section */}
      <View style={styles.publicationsSection}>
        <View style={styles.sectionHeader}>
          <SkeletonBox style={styles.sectionTitleSkeleton} />
          <SkeletonBox style={styles.seeAllSkeleton} />
        </View>

        {/* Job Cards Skeleton */}
        <JobCardSkeleton opacity={opacity} />
        <JobCardSkeleton opacity={opacity} />
        <JobCardSkeleton opacity={opacity} />
      </View>

      {/* Applications Section */}
      <View style={styles.publicationsSection}>
        <View style={styles.sectionHeader}>
          <SkeletonBox style={styles.sectionTitleSkeleton} />
          <SkeletonBox style={styles.seeAllSkeleton} />
        </View>

        {/* Job Cards Skeleton */}
        <JobCardSkeleton opacity={opacity} />
        <JobCardSkeleton opacity={opacity} />
        <JobCardSkeleton opacity={opacity} />
      </View>

      {/* Logout Button Skeleton */}
      <View style={styles.btnSalirContainer}>
        <SkeletonBox style={styles.btnSalirSkeleton} />
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// Componente auxiliar para las tarjetas de trabajo
const JobCardSkeleton = ({ opacity }: { opacity: Animated.AnimatedInterpolation<number> }) => {
  const SkeletonBox = ({ style }: { style?: any }) => (
    <Animated.View style={[styles.skeleton, { opacity }, style]} />
  );

  return (
    <View style={styles.jobCard}>
      <SkeletonBox style={styles.jobIconSkeleton} />
      <View style={styles.jobContent}>
        <View style={styles.jobHeader}>
          <SkeletonBox style={styles.jobTitleSkeleton} />
          <SkeletonBox style={styles.badgeSkeleton} />
        </View>
        <SkeletonBox style={styles.jobDescriptionSkeleton} />
        <View style={styles.jobFooter}>
          <SkeletonBox style={styles.jobPriceSkeleton} />
          <SkeletonBox style={styles.jobDateSkeleton} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  header: {
    backgroundColor: "#1E3A8A",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitleSkeleton: {
    width: 150,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarSkeleton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: "#FCD34D",
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userNameSkeleton: {
    width: 200,
    height: 26,
    marginBottom: 8,
  },
  locationSkeleton: {
    width: 150,
    height: 16,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumberSkeleton: {
    width: 60,
    height: 32,
    marginBottom: 4,
  },
  statLabelSkeleton: {
    width: 100,
    height: 14,
  },
  aboutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitleSkeleton: {
    width: 100,
    height: 13,
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aboutTextSkeleton: {
    width: '100%',
    height: 15,
  },
  publicationsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllSkeleton: {
    width: 80,
    height: 15,
  },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobIconSkeleton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  jobContent: {
    flex: 1,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  jobTitleSkeleton: {
    width: 120,
    height: 16,
  },
  badgeSkeleton: {
    width: 70,
    height: 20,
    borderRadius: 8,
  },
  jobDescriptionSkeleton: {
    width: '100%',
    height: 14,
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobPriceSkeleton: {
    width: 80,
    height: 16,
  },
  jobDateSkeleton: {
    width: 100,
    height: 13,
  },
  btnSalirContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  btnSalirSkeleton: {
    width: '100%',
    height: 50,
    borderRadius: 30,
  },
});

export default ProfileSkeleton;