import { usePostRating } from "@/hooks/useRating";
import { useGetUserById } from "@/hooks/useWork";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ICreateRatingDTO } from "../types/IRatingData.Types";

interface RateWorkerScreenProps {
  workId: string;
  workerName: string;
  workerImage: string;
  workTitle: string;
  startTime: string;
  onSubmitRating: (rating: number, comment: string) => void;
}

interface RatingFormData {
  rating: number;
  comment: string;
}

export default function RateWorkerScreen({
  
  workerName,
  workerImage,
  workTitle,
  startTime,
  onSubmitRating,
}: RateWorkerScreenProps) {
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);
  const params = useLocalSearchParams();
  const { employerId, workerId, workId } = params as { 
    employerId?: string; 
    workerId?: string; 
    workId?: string;
  };

  // Hook para obtener la información del empleador
  const { data: employerData } = useGetUserById(employerId || workerId || '');

  // Hook para crear el rating
  const { mutate: postRating, isPending } = usePostRating();
  
  // React Hook Form
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RatingFormData>({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });

  const rating = watch('rating');

  const handleStarPress = (star: number) => {
    // Este se actualizará a través de React Hook Form
  };

  const onSubmit = async (data: RatingFormData) => {
    const ratingPayload: ICreateRatingDTO = {
      userId: workerId || employerData?.id,
      workId: workId,
      score: data.rating,
      comment: data.comment,
      type: "worker"
    };

    postRating(ratingPayload, {
      onSuccess: (response) => {
        router.back();
      },
      onError: (error) => {
      }
    });
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return "Muy malo";
      case 2:
        return "Malo";
      case 3:
        return "Regular";
      case 4:
        return "Muy bueno";
      case 5:
        return "Excelente";
      default:
        return "";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Decorative Header Bar */}
      <View style={styles.headerBar} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>¡Trabajo Terminado!</Text>
          <Text style={styles.subtitle}>
            Tu opinión ayuda a mantener segura la comunidad
          </Text>
        </View>

        {/* Worker Card */}
        <View style={styles.workerCard}>
          <View style={styles.workerHeader}>
            <Image source={{ uri: employerData?.data.imageProfile }} style={styles.workerAvatar} />
            <View style={styles.activeIndicator} />
          </View>
          <Text style={styles.ratingLabel}>CALIFICANDO A</Text>
          <Text style={styles.workerName}>{employerData?.data.fullName}</Text>
          <View style={styles.workInfoRow}>
            <Text style={styles.workTitle}>{workTitle}</Text>
            <Text style={styles.workTime}>• {startTime}</Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingQuestion}>¿CÓMO FUE TU EXPERIENCIA?</Text>

          <Controller
            control={control}
            name="rating"
            rules={{ 
              required: "Debes seleccionar una calificación",
              min: { value: 1, message: "Selecciona al menos 1 estrella" }
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => onChange(star)}
                    onPressIn={() => setHoveredRating(star)}
                    onPressOut={() => setHoveredRating(0)}
                    activeOpacity={0.7}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={star <= (hoveredRating || value) ? "star" : "star-outline"}
                      size={56}
                      color={star <= (hoveredRating || value) ? "#FFD700" : "#D0D0D0"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />

          {rating > 0 && (
            <Text style={styles.ratingLabelText}>
              {getRatingLabel(rating)}
            </Text>
          )}
          {errors.rating && (
            <Text style={styles.errorText}>{errors.rating.message}</Text>
          )}
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>
            Comparte más detalles (Opcional)
          </Text>
          <Controller
            control={control}
            name="comment"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe aquí tu reseña sobre el servicio..."
                placeholderTextColor="#B0B0B0"
                multiline
                numberOfLines={5}
                maxLength={500}
                value={value}
                onChangeText={onChange}
                textAlignVertical="top"
              />
            )}
          />
          <Text style={styles.commentHint}>
            Tus reseñas son públicas y ayudan a otros usuarios de ChangaYa.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || isPending) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={rating === 0 || isPending}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {isPending ? "Enviando..." : "Finalizar y Enviar"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.bottomHint}>
          PASO OBLIGATORIO PARA COMPLETAR LA CHANGA
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerBar: {
    height: 6,
    backgroundColor: "#0066FF",
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E3A5F",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#5A6C7D",
    textAlign: "center",
    lineHeight: 22,
  },
  workerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  workerHeader: {
    position: "relative",
    marginBottom: 16,
  },
  workerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0066FF",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  workerName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E3A5F",
    marginBottom: 12,
  },
  workInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  workTitle: {
    fontSize: 14,
    color: "#5A6C7D",
    fontWeight: "500",
  },
  workTime: {
    fontSize: 14,
    color: "#8A8A8A",
  },
  ratingSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingQuestion: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D3748",
    letterSpacing: 0.8,
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingLabelText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0066FF",
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: 8,
    fontWeight: "500",
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#2D3748",
    borderWidth: 1,
    borderColor: "#E8ECF0",
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commentHint: {
    fontSize: 12,
    color: "#8A8A8A",
    marginTop: 8,
    lineHeight: 18,
  },
  bottomContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#E8ECF0",
  },
  submitButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#B0B0B0",
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomHint: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 12,
    letterSpacing: 0.5,
  },
});