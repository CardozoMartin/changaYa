import ProfileError from "@/components/Errors/ProfileError";
import ProfileSkeleton from "@/components/Skeleton/ProfileSkeleton";
import { useAuthSessionStore } from "@/store/authSessionStore";
import { Ionicons } from "@expo/vector-icons";
import { createClient } from "@supabase/supabase-js";
import { router } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useGetProfileData } from "../../hooks/useAuth";
import NotificationBell from "@/components/Notifications/NotificationBell";

// Configuración de Supabase
const supabaseUrl = "https://mjuflmbpbpsltvbjuqzj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdWZsbWJwYnBzbHR2Ymp1cXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NzQ5MzYsImV4cCI6MjA4MTE1MDkzNn0.4be5UDBeAS1PULHBqxnudo9-i3zOi4Ft5JDVICIhqpg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProfileScreen = () => {
  //hook para obtener informacion del pefil
  const { data: profileData, isLoading, error } = useGetProfileData();
  const dataUSer = profileData?.data ?? null;
  const { clearAuth } = useAuthSessionStore();
  const handleLogout = async () => {

    try {
      // Limpiar sesión de Supabase (Google OAuth)
      await supabase.auth.signOut();
    } catch (error) {
    }
    
    // Limpiar sesión del store local
    clearAuth();
    
    // Redirigir a login
    router.replace('/auth/LoginScreen');
  }

  if (isLoading) {
    return (
      <ProfileSkeleton />
    );
  }

  if (error) {
    return (
      <ProfileError />
    );
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con campanita */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        
        <View style={styles.headerActions}>
          {/* Campanita de notificaciones */}
          <NotificationBell iconColor="#fff" iconSize={24} />
          
          {/* Botón de configuración */}
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
          {dataUSer?.imageProfile ? (
            <Image
              source={{ uri: dataUSer?.imageProfile }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={80} color="#D4A574" />
          )}
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
        <Text style={styles.userName}>
          {dataUSer?.fullName || "Marcos García"}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#64B5F6" />
          <Text style={styles.locationText}>{dataUSer?.address}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star" size={24} color="#1E3A8A" />
          </View>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconContainer, { backgroundColor: "#DBEAFE" }]}
          >
            <Ionicons name="briefcase" size={24} color="#1E3A8A" />
          </View>
          <Text style={styles.statNumber}>{dataUSer?.works?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Changas Publicadas</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>SOBRE MÍ</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>{dataUSer?.description}</Text>
        </View>
      </View>

      {/* Publications Section */}
      <View style={styles.publicationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Publicaciones</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas →</Text>
          </TouchableOpacity>
        </View>

        {/* Active Job Card */}
        <View style={styles.jobCard}>
          <View style={styles.jobIconContainer}>
            <Ionicons name="brush" size={28} color="#1E3A8A" />
          </View>
          <View style={styles.jobContent}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>Pintura de Fachada</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ACTIVO</Text>
              </View>
            </View>
            <Text style={styles.jobDescription} numberOfLines={1}>
              Se busca pintor para frente de casa 2...
            </Text>
            <View style={styles.jobFooter}>
              <Text style={styles.jobPrice}>$15.000</Text>
              <Text style={styles.jobDate}>Publicado hoy</Text>
            </View>
          </View>
        </View>

        {/* Completed Job Card 1 */}
        <View style={styles.jobCard}>
          <View
            style={[styles.jobIconContainer, { backgroundColor: "#F3F4F6" }]}
          >
            <Ionicons name="hammer" size={28} color="#9CA3AF" />
          </View>
          <View style={styles.jobContent}>
            <View style={styles.jobHeader}>
              <Text style={[styles.jobTitle, { color: "#9CA3AF" }]}>
                Reparación de Cañería
              </Text>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>FINALIZADO</Text>
              </View>
            </View>
            <Text
              style={[styles.jobDescription, { color: "#9CA3AF" }]}
              numberOfLines={1}
            >
              Filtración en cocina, cambio de...
            </Text>
            <View style={styles.jobFooter}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
              </View>
              <Text style={styles.jobDate}>2 semanas atrás</Text>
            </View>
          </View>
        </View>

        {/* Completed Job Card 2 */}
        <View style={styles.jobCard}>
          <View
            style={[styles.jobIconContainer, { backgroundColor: "#F3F4F6" }]}
          >
            <Ionicons name="flash" size={28} color="#9CA3AF" />
          </View>
          <View style={styles.jobContent}>
            <View style={styles.jobHeader}>
              <Text style={[styles.jobTitle, { color: "#9CA3AF" }]}>
                Instalación Térmica
              </Text>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>FINALIZADO</Text>
              </View>
            </View>
            <Text
              style={[styles.jobDescription, { color: "#9CA3AF" }]}
              numberOfLines={1}
            >
              Tablero eléctrico nuevo para...
            </Text>
            <View style={styles.jobFooter}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star-outline" size={14} color="#FCD34D" />
                <Ionicons name="star-outline" size={14} color="#FCD34D" />
              </View>
              <Text style={styles.jobDate}>1 mes atrás</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Publications Section */}
      <View style={styles.publicationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Postulaciones</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas →</Text>
          </TouchableOpacity>
        </View>

        {/* Active Job Card */}
        <View style={styles.jobCard}>
          <View style={styles.jobIconContainer}>
            <Ionicons name="brush" size={28} color="#1E3A8A" />
          </View>
          <View style={styles.jobContent}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>Pintura de Fachada</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ACTIVO</Text>
              </View>
            </View>
            <Text style={styles.jobDescription} numberOfLines={1}>
              Se busca pintor para frente de casa 2...
            </Text>
            <View style={styles.jobFooter}>
              <Text style={styles.jobPrice}>$15.000</Text>
              <Text style={styles.jobDate}>Publicado hoy</Text>
            </View>
          </View>
        </View>

        {/* Completed Job Card 1 */}
        <View style={styles.jobCard}>
          <View
            style={[styles.jobIconContainer, { backgroundColor: "#F3F4F6" }]}
          >
            <Ionicons name="hammer" size={28} color="#9CA3AF" />
          </View>
          <View style={styles.jobContent}>
            <View style={styles.jobHeader}>
              <Text style={[styles.jobTitle, { color: "#9CA3AF" }]}>
                Reparación de Cañería
              </Text>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>FINALIZADO</Text>
              </View>
            </View>
            <Text
              style={[styles.jobDescription, { color: "#9CA3AF" }]}
              numberOfLines={1}
            >
              Filtración en cocina, cambio de...
            </Text>
            <View style={styles.jobFooter}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
              </View>
              <Text style={styles.jobDate}>2 semanas atrás</Text>
            </View>
          </View>
        </View>

        {/* Completed Job Card 2 */}
        <View style={styles.jobCard}>
          <View
            style={[styles.jobIconContainer, { backgroundColor: "#F3F4F6" }]}
          >
            <Ionicons name="flash" size={28} color="#9CA3AF" />
          </View>
          <View style={styles.jobContent}>
            <View style={styles.jobHeader}>
              <Text style={[styles.jobTitle, { color: "#9CA3AF" }]}>
                Instalación Térmica
              </Text>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>FINALIZADO</Text>
              </View>
            </View>
            <Text
              style={[styles.jobDescription, { color: "#9CA3AF" }]}
              numberOfLines={1}
            >
              Tablero eléctrico nuevo para...
            </Text>
            <View style={styles.jobFooter}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star" size={14} color="#FCD34D" />
                <Ionicons name="star-outline" size={14} color="#FCD34D" />
                <Ionicons name="star-outline" size={14} color="#FCD34D" />
              </View>
              <Text style={styles.jobDate}>1 mes atrás</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.btnSalir} activeOpacity={0.8}
        onPress={handleLogout}>
        <Text style={styles.btnSalirText}>Cerrar Sesion</Text>
      </TouchableOpacity>

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  settingsButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E8D4B8",
    borderWidth: 6,
    borderColor: "#FCD34D",
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
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
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    color: "#64B5F6",
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
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  aboutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 12,
    letterSpacing: 0.5,
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
  aboutText: {
    fontSize: 15,
    color: "#6B7280",
    fontStyle: "italic",
    lineHeight: 22,
  },
  publicationsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 15,
    color: "#3B82F6",
    fontWeight: "600",
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
  jobIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
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
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  activeBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  completedBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
  },
  jobDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  jobDate: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  btnSalir: {
    backgroundColor: '#fa0f0f',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnSalirText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileScreen;
