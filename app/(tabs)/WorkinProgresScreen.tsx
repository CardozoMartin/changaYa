import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface WorkInProgressScreenProps {
  workId: string;
  workTitle: string;
  workerName: string;
  workerRole: string;
  workerImage: string;
  serviceDescription: string;
  location: string;
  startTime: string;
  mapPreviewUrl?: string;
}

export default function WorkInProgressScreen({
  workId,
  workTitle,
  workerName,
  workerRole,
  workerImage,
  serviceDescription,
  location,
  startTime,
  mapPreviewUrl,
}: WorkInProgressScreenProps) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Obtener parámetros de navegación
  const params = useLocalSearchParams();
  
  console.log("📋 Parámetros recibidos en WorkInProgressScreen:");
  console.log("   - workerId:", params?.workerId);
  console.log("   - employerId:", params?.employerId);
  console.log("   - workId:", params?.workId);
  console.log("   - Todos los parámetros:", params);

  const handleContact = () => {
    // Aquí iría la lógica para contactar al trabajador
    console.log("Contactar trabajador");
  };

  const handleViewMap = () => {
    // Abrir mapa en vivo
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    Linking.openURL(url);
  };

  const handleMarkComplete = () => {
    setIsCompleting(true);
    // Navegar a pantalla de calificación
    router.push({
      pathname: "/(tabs)/RateEmployerScreen",
      params: {
        workId,
        workerName,
        workerImage,
        workTitle,
        startTime,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Changa en Progreso</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Ionicons name="flash" size={18} color="#0066FF" />
          <Text style={styles.statusText}>SERVICIO ACTIVO</Text>
        </View>

        {/* Worker Card */}
        <View style={styles.workerCard}>
          <View style={styles.workerInfo}>
            <View>
              <Text style={styles.workerLabel}>Trabajador seleccionado</Text>
              <Text style={styles.workerName}>{workerName}</Text>
              <Text style={styles.workerRole}>{workerRole}</Text>
            </View>
            <Image source={{ uri: workerImage }} style={styles.workerImage} />
          </View>

          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contactar</Text>
          </TouchableOpacity>
        </View>

        {/* Service Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Detalles del Servicio</Text>

          {/* Service Description */}
          <View style={styles.detailCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="flash" size={24} color="#0066FF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{workTitle}</Text>
              <Text style={styles.detailSubtitle}>{serviceDescription}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={24} color="#0066FF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Ubicación</Text>
              <Text style={styles.detailSubtitle}>{location}</Text>
            </View>
          </View>

          {/* Start Time */}
          <View style={styles.detailCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="time" size={24} color="#0066FF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Horario de Inicio</Text>
              <Text style={styles.detailSubtitle}>{startTime}</Text>
            </View>
          </View>

          {/* Map Preview */}
          <TouchableOpacity
            style={styles.mapContainer}
            onPress={handleViewMap}
            activeOpacity={0.8}
          >
            {mapPreviewUrl ? (
              <Image
                source={{ uri: mapPreviewUrl }}
                style={styles.mapImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={48} color="#B0B0B0" />
                <Text style={styles.mapPlaceholderText}>Mapa no disponible</Text>
              </View>
            )}
            <View style={styles.mapOverlay}>
              <View style={styles.mapButton}>
                <Ionicons name="navigate" size={20} color="#0066FF" />
                <Text style={styles.mapButtonText}>MAPA EN VIVO</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Completion Section */}
        <View style={styles.completionSection}>
          <Text style={styles.completionQuestion}>
            ¿El trabajo ha finalizado correctamente?
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompleting && styles.completeButtonDisabled,
          ]}
          onPress={handleMarkComplete}
          disabled={isCompleting}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>Marcar como Completada</Text>
        </TouchableOpacity>
        <Text style={styles.bottomHint}>
          Al confirmar, podrás calificar la atención de {workerName}.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A5F",
  },
  scrollView: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0066FF",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  workerCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  workerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  workerLabel: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 4,
  },
  workerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E3A5F",
    marginBottom: 4,
  },
  workerRole: {
    fontSize: 16,
    color: "#0066FF",
    fontWeight: "600",
  },
  workerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#E8ECF0",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066FF",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A5F",
    marginBottom: 16,
  },
  detailCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A5F",
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: 14,
    color: "#5A6C7D",
    lineHeight: 20,
  },
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: "#E8ECF0",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#B0B0B0",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0066FF",
    letterSpacing: 0.5,
  },
  completionSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  completionQuestion: {
    fontSize: 16,
    color: "#2D3748",
    textAlign: "center",
    fontWeight: "500",
  },
  bottomContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#E8ECF0",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066FF",
    paddingVertical: 18,
    borderRadius: 14,
    gap: 10,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonDisabled: {
    backgroundColor: "#B0B0B0",
    shadowOpacity: 0,
  },
  completeButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomHint: {
    fontSize: 13,
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
});