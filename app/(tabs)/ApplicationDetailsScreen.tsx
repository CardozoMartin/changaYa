import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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
} from "react-native";

type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

interface ApplicationData {
  application: {
    id: string;
    status: ApplicationStatus;
    createdAt: string;
  };
  employer: {
    id: string;
    fullName: string;
    email: string;
    imageProfile: string;
    ratingStats?: any;
  };
  work: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    imageWork?: string[] | any[];
  };
}

const ApplicationDetailsScreen = () => {
  const { applicationData } = useLocalSearchParams<{ applicationData?: string }>();

  const [loading, setLoading] = React.useState(false);

  let data: ApplicationData | null = null;

  try {
    if (applicationData) {
      data = JSON.parse(applicationData);
    }
  } catch (error) {
    console.log("Error parsing application data", error);
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1142d4" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "PENDIENTE",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
          description: "Tu postulación está siendo revisada",
        };
      case "accepted":
        return {
          label: "ACEPTADA",
          bgColor: "#D1FAE5",
          textColor: "#065F46",
          description: "¡Felicidades! Tu postulación fue aceptada",
        };
      case "rejected":
        return {
          label: "RECHAZADA",
          bgColor: "#FEE2E2",
          textColor: "#991B1B",
          description: "Tu postulación fue rechazada",
        };
      case "completed":
        return {
          label: "FINALIZADA",
          bgColor: "#E5E7EB",
          textColor: "#374151",
          description: "El trabajo fue completado",
        };
    }
  };

  const statusConfig = getStatusConfig(data.application.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de Postulación</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagen del trabajo */}
        <View style={styles.imageSection}>
          {(() => {
            const workImage = Array.isArray(data.work.imageWork)
              ? data.work.imageWork[0]
              : data.work.imageWork;
            return workImage ? (
              <Image
                source={{ uri: workImage }}
                style={styles.workImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.workImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            );
          })()}

          {/* Badge de estado superpuesto */}
          <View
            style={[
              styles.statusBadgeOverlay,
              { backgroundColor: statusConfig.bgColor },
            ]}
          >
            <Text style={[styles.statusTextOverlay, { color: statusConfig.textColor }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.mainContent}>
          {/* Título del trabajo */}
          <Text style={styles.workTitle}>{data.work.title}</Text>

          {/* Estado descriptor */}
          <View style={styles.statusDescriptionBox}>
            <Text style={[styles.statusDescription, { color: statusConfig.textColor }]}>
              {statusConfig.description}
            </Text>
          </View>

          {/* Información del trabajo */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Información del Trabajo</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Ubicación</Text>
              <Text style={styles.infoValue}>{data.work.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📝 Descripción</Text>
              <Text style={styles.infoValue}>{data.work.description}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Postulado el</Text>
              <Text style={styles.infoValue}>{formatDate(data.application.createdAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🔄 Estado del trabajo</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {data.work.status === "open" ? "Abierto" : "Cerrado"}
              </Text>
            </View>
          </View>

          {/* Perfil del empleador */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quién Publicó el Trabajo</Text>

            <View style={styles.employerCard}>
              {/* Avatar del empleador */}
              <Image
                source={{ uri: data.employer.imageProfile }}
                style={styles.employerAvatar}
              />

              {/* Información del empleador */}
              <View style={styles.employerInfo}>
                <Text style={styles.employerName}>{data.employer.fullName}</Text>
                <Text style={styles.employerEmail}>{data.employer.email}</Text>

                {/* Rating si existe */}
                {data.employer.ratingStats && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>
                      ⭐ {data.employer.ratingStats.average || "N/A"} (
                      {data.employer.ratingStats.count || 0} calificaciones)
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtonsContainer}>
            {data.application.status === "accepted" && (
              <>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Contactar Empleador</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Ver Chat</Text>
                </TouchableOpacity>
              </>
            )}

            {data.application.status === "pending" && (
              <>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Contactar Empleador</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerButton}>
                  <Text style={styles.dangerButtonText}>Cancelar Postulación</Text>
                </TouchableOpacity>
              </>
            )}

            {data.application.status === "completed" && (
              <>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Ver Reseña</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Ver Perfil del Empleador</Text>
                </TouchableOpacity>
              </>
            )}

            {data.application.status === "rejected" && (
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Explorar Otros Trabajos</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 24,
    color: "#1142d4",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D111B",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  workImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  statusBadgeOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusTextOverlay: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  mainContent: {
    padding: 16,
  },
  workTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D111B",
    marginBottom: 16,
    lineHeight: 30,
  },
  statusDescriptionBox: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  statusDescription: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D111B",
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  employerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  employerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  employerInfo: {
    flex: 1,
  },
  employerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D111B",
    marginBottom: 4,
  },
  employerEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  ratingContainer: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },
  actionButtonsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#1142d4",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#E8EAED",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D111B",
  },
  dangerButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#991B1B",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});

export default ApplicationDetailsScreen;
