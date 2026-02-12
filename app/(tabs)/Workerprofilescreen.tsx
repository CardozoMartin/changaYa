import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetUserById } from '@/hooks/useWork';
import { Ionicons } from '@expo/vector-icons';
import { useGetFullProfileById } from '@/hooks/useAuth';

// ─── Icon placeholders (swap for react-native-vector-icons) ───────────────────
const PhoneIcon = () => (
  <View style={styles.iconCircle}>
    <Text style={styles.iconText}>📞</Text>
  </View>
);
const EmailIcon = () => (
  <View style={styles.iconCircle}>
    <Text style={styles.iconText}>✉️</Text>
  </View>
);
const LocationIcon = () => (
  <View style={styles.iconCircle}>
    <Text style={styles.iconText}>📍</Text>
  </View>
);
const BackIcon = () => <Text style={styles.navIconText}>‹</Text>;
const ShareIcon = () => <Text style={styles.navIconText}>⬆</Text>;
const ChatIcon = () => <Text style={{ color: '#fff', fontSize: 16 }}>💬</Text>;
const HeartIcon = () => <Text style={{ fontSize: 20 }}>🤍</Text>;

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating = 5, size = 18, color = '#F59E0B' }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {stars.map((star) => (
        <Text
          key={star}
          style={{
            fontSize: size,
            color: star <= Math.round(rating) ? color : '#D1D5DB',
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );
};

// ─── Skill Tag ────────────────────────────────────────────────────────────────
const SkillTag = ({ label }: { label: string }) => (
  <View style={styles.skillTag}>
    <Text style={styles.skillTagText}>{label}</Text>
  </View>
);

// ─── Contact Row ─────────────────────────────────────────────────────────────
const ContactRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <View style={styles.contactRow}>
    {icon}
    <View style={styles.contactTextWrap}>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
  </View>
);

// ─── Review Card ─────────────────────────────────────────────────────────────
const ReviewCard = ({ name, rating, time, text, service, avatarBg, avatarImage }: { name: string; rating: number; time: string; text: string; service: string; avatarBg: string; avatarImage: string | null }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      {avatarImage ? (
        <Image
          source={{ uri: avatarImage }}
          style={styles.reviewAvatarImage}
        />
      ) : (
        <View style={[styles.reviewAvatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.reviewAvatarInitial}>{name.charAt(0)}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.reviewTopRow}>
          <Text style={styles.reviewName}>{name}</Text>
          <Text style={styles.reviewTime}>{time}</Text>
        </View>
        <StarRating rating={rating} size={14} />
      </View>
    </View>
    <Text style={styles.reviewText}>"{text}"</Text>
    <Text style={styles.reviewService}>Servicio: {service}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WorkerProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  // Hook para obtener datos del trabajador
  const { data: userProfileData, isLoading, error } = useGetFullProfileById(userId);
  const workerData = userProfileData?.data;

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1142d4" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !workerData) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar el perfil</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Mapear habilidades desde el backend
  const skills = workerData?.hability || [];

  // Función para calcular tiempo relativo
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  // Colores para avatares de reviews
  const avatarColors = ['#6B7280', '#374151', '#4B5563', '#1F2937', '#9CA3AF'];

  // Mapear reviews desde el backend
  const reviews = workerData?.comments?.map((comment: any, index: number) => ({
    name: comment.reviewerName || 'Usuario',
    rating: comment.score || 0,
    time: getRelativeTime(comment.createdAt),
    text: comment.comment || '',
    service: 'Trabajo completado',
    avatarBg: avatarColors[index % avatarColors.length],
    avatarImage: comment.reviewerImage || null,
  })) || [];

  // Stats
  const workerRating = workerData?.averageRating || 0;
  const reviewCount = workerData?.ratingStats?.asWorker?.count || 0;
  const totalWorks = workerData?.totalWorks || 0;
  const reports = workerData?.reportStats?.reportsReceived || 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Nav Bar ── */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#0D111B" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Perfil del Trabajador</Text>
        <View style={styles.navBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero / Avatar ── */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            {workerData?.imageProfile ? (
              <Image 
                source={{ uri: workerData.imageProfile }} 
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarFallback}>
                  {workerData?.fullName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            {workerData?.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedCheck}>✓</Text>
              </View>
            )}
          </View>

          <Text style={styles.workerName}>{workerData?.fullName || 'Usuario'}</Text>
          <Text style={styles.workerRole}>{workerData?.description || 'Sin descripción'}</Text>

          <View style={styles.ratingRow}>
            <StarRating rating={workerRating} size={22} />
            <Text style={styles.ratingScore}> {workerRating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({reviewCount} reseñas)</Text>
          </View>

          {/* Trabajos completados */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalWorks}</Text>
              <Text style={styles.statLabel}>Trabajos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reviewCount}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
          </View>

          {/* Advertencia de reportes si existen */}
          {reports > 0 && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningDot}>⚠</Text>
              <Text style={styles.warningText}>{reports} reporte{reports > 1 ? 's' : ''} recibido{reports > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES</Text>
            <View style={styles.tagsWrap}>
              {skills.map((skill: string, index: number) => (
                <SkillTag key={`${skill}-${index}`} label={skill} />
              ))}
            </View>
          </View>
        )}

        {/* ── Contact Info ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información de Contacto</Text>
          <ContactRow
            icon={<PhoneIcon />}
            label="Teléfono"
            value={workerData?.phone || 'No disponible'}
          />
          <View style={styles.divider} />
          <ContactRow
            icon={<EmailIcon />}
            label="Correo Electrónico"
            value={workerData?.email || 'No disponible'}
          />
          <View style={styles.divider} />
          <ContactRow
            icon={<LocationIcon />}
            label="Ubicación principal"
            value={workerData?.address || 'No disponible'}
          />
        </View>

        {/* ── Reviews ── */}
        {reviews.length > 0 ? (
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Reseñas de Empleadores</Text>
              <Text style={styles.reviewCount}>{reviews.length} reseña{reviews.length > 1 ? 's' : ''}</Text>
            </View>

            {reviews.map((r: any, index: number) => (
              <ReviewCard key={`review-${index}`} {...r} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyReviewsSection}>
            <Text style={styles.emptyReviewsText}>Aún no hay reseñas</Text>
          </View>
        )}

        {/* Bottom spacing so content isn't hidden by sticky CTA */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky CTA ── */}
     
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // Nav
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 0.1,
  },
  navIconText: {
    fontSize: 26,
    color: '#111827',
    fontWeight: '300',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Hero
  heroSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FBBF88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  workerName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  workerRole: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  warningDot: {
    fontSize: 13,
    color: '#D97706',
    marginRight: 6,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },

  // Skills section
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.2,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  skillTagText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },

  // Contact card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconText: {
    fontSize: 16,
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 50,
  },

  // Reviews
  reviewsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  reviewsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyReviewsSection: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyReviewsText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  seeAll: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  reviewAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  reviewTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    marginBottom: 8,
  },
  reviewService: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },

  // CTA
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heartButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loading & Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1142d4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});