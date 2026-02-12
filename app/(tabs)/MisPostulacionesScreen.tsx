import { useGetMyApplicationsJobsByUser } from "@/hooks/useAplyToWork";
import { router } from "expo-router";
import React, { useState } from "react";
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

// Tipos para las postulaciones
type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

interface Application {
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

const MisPostulacionesScreen = () => {
  const [activeTab, setActiveTab] = useState<"all" | ApplicationStatus>("all");

  // Hook para obtener las postulaciones reales
  const { data: applications = [], isLoading, error } = useGetMyApplicationsJobsByUser();

  console.log("Mis postulaciones:", applications);

  // Filtrar postulaciones según el tab activo
  const filteredApplications: Application[] =
    activeTab === "all"
      ? applications
      : (applications.filter((app: Application) => app.application.status === activeTab) as Application[]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    return `${day} ${month}`;
  };

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "PENDIENTE",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
        };
      case "accepted":
        return {
          label: "ACEPTADA",
          bgColor: "#D1FAE5",
          textColor: "#065F46",
        };
      case "rejected":
        return {
          label: "RECHAZADA",
          bgColor: "#FEE2E2",
          textColor: "#991B1B",
        };
      case "completed":
        return {
          label: "FINALIZADA",
          bgColor: "#E5E7EB",
          textColor: "#374151",
        };
    }
  };

  const getTabLabel = (tab: "all" | ApplicationStatus) => {
    switch (tab) {
      case "all":
        return "Todas";
      case "pending":
        return "Pendientes";
      case "accepted":
        return "Aceptadas";
      case "rejected":
        return "Rechazadas";
      case "completed":
        return "Completadas";
    }
  };

  const renderApplicationCard = (application: Application) => {
    const statusConfig = getStatusConfig(application.application.status);
    const workImage = Array.isArray(application.work.imageWork)
      ? application.work.imageWork[0]
      : application.work.imageWork;

    return (
      <TouchableOpacity
        key={application.application.id}
        style={styles.applicationCard}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/ApplicationDetailsScreen",
            params: {
              applicationId: application.application.id,
              applicationData: JSON.stringify(application),
            },
          })
        }
      >
        {/* Imagen del trabajo */}
        <View style={styles.imageContainer}>
          {workImage ? (
            <Image
              source={{ uri: workImage }}
              style={styles.jobImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.jobImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>Sin imagen</Text>
            </View>
          )}

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

        {/* Contenido */}
        <View style={styles.cardContent}>
          {/* Título */}
          <Text style={styles.jobTitle} numberOfLines={2}>
            {application.work.title}
          </Text>

          {/* Ubicación */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {application.work.location}
            </Text>
          </View>

          {/* Fecha */}
          <Text style={styles.dateText}>
            Postulado: {formatDate(application.application.createdAt)}
          </Text>

          {/* Botón Ver Detalles */}
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
          <Text style={styles.errorTitle}>
            Error al cargar las postulaciones
          </Text>
          <Text style={styles.errorMessage}>
            {error?.message || "Ocurrió un error inesperado"}
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

        <TouchableOpacity style={styles.notificationButton} onPress={() => {}}>
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
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              {getTabLabel("all")}
            </Text>
            {activeTab === "all" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "pending" && styles.activeTab]}
            onPress={() => setActiveTab("pending")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "pending" && styles.activeTabText,
              ]}
            >
              {getTabLabel("pending")}
            </Text>
            {activeTab === "pending" && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "accepted" && styles.activeTab]}
            onPress={() => setActiveTab("accepted")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "accepted" && styles.activeTabText,
              ]}
            >
              {getTabLabel("accepted")}
            </Text>
            {activeTab === "accepted" && <View style={styles.tabIndicator} />}
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
          filteredApplications.map((application: Application) =>
            renderApplicationCard(application),
          )
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <View style={styles.emptyDocBody} />
            </View>
            <Text style={styles.emptyTitle}>
              No tienes postulaciones{" "}
              {activeTab !== "all" && getTabLabel(activeTab).toLowerCase()}
            </Text>
            <Text style={styles.emptyMessage}>
              Explora trabajos disponibles y postúlate
            </Text>
          </View>
        )}

        {/* Espacio al final para el menú inferior */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EF4444",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    position: "relative",
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#0D111B",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    left: 8,
    top: 7,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D111B",
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    width: 24,
    height: 24,
    position: "relative",
  },
  bellBody: {
    width: 18,
    height: 16,
    borderWidth: 2.5,
    borderColor: "#0D111B",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
    position: "absolute",
    top: 3,
    left: 3,
  },
  bellClapper: {
    width: 4,
    height: 6,
    backgroundColor: "#0D111B",
    borderRadius: 2,
    position: "absolute",
    top: 0,
    left: 10,
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    paddingVertical: 16,
    position: "relative",
  },
  activeTab: {},
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#1142d4",
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#1142d4",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  jobImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
    gap: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D111B",
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  detailButton: {
    backgroundColor: "#1142d4",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starIconSmall: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#F4C542",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D111B",
  },
  contactButton: {
    backgroundColor: "#1142d4",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    position: "relative",
    marginBottom: 24,
    opacity: 0.3,
  },
  emptyDocBody: {
    width: 60,
    height: 70,
    borderWidth: 3,
    borderColor: "#9CA3AF",
    borderRadius: 8,
    position: "absolute",
    top: 5,
    left: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D111B",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default MisPostulacionesScreen;
