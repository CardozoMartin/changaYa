import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useWork } from '@/hooks/useWork';
import WorkOpportunitiesList from '@/components/Opportunities/WorkOpportunitiesList';
import { useAuthSessionStore } from '@/store/authSessionStore';


const OpportunitiesScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Inicio');
  const { user } = useAuthSessionStore();

  const { data: works, isLoading, error } = useWork();

  if(isLoading){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando oportunidades...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if(error){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Error al cargar oportunidades.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header fijo - No hace scroll */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Image 
                source={{ uri: user?.imageProfile }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.greeting}>Hola, {user?.fullName}</Text>
                <Text style={styles.subGreeting}>Encuentra tu próximo trabajo</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.bellIcon}>
                <View style={styles.bellBody} />
                <View style={styles.bellClapper} />
              </View>
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <View style={styles.searchCircle} />
              <View style={styles.searchHandle} />
            </View>
            <TextInput 
              placeholder="Buscar por palabra clave..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>

          {/* Filter Buttons */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            <TouchableOpacity style={styles.filterButton}>
              <View style={styles.filterIcon}>
                <View style={styles.filterLine1} />
                <View style={styles.filterLine2} />
                <View style={styles.filterLine3} />
              </View>
              <Text style={styles.filterText}>Filtros</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterButtonOutline}>
              <View style={styles.categoryIcon}>
                <View style={styles.tagShape} />
              </View>
              <Text style={styles.filterTextOutline}>Categoría</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterButtonOutline}>
              <View style={styles.locationIconSmall}>
                <View style={styles.locationPinSmall} />
              </View>
              <Text style={styles.filterTextOutline}>Ubicación</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButtonOutline}>
              <Text style={styles.filterTextOutline}>💰 Salario</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButtonOutline}>
              <Text style={styles.filterTextOutline}>⏰ Jornada</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content con scroll */}
        <ScrollView 
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.contentWrapper}>
            <Text style={styles.sectionTitle}>Oportunidades para ti</Text>

            {/* Componente que maneja la lista de trabajos del backend */}
            <WorkOpportunitiesList 
              works={works} 
              isLoading={isLoading} 
              error={error} 
            />

            {/* Espaciado adicional al final para que no choque con el menú */}
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  bellIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  bellBody: {
    width: 18,
    height: 18,
    borderWidth: 2.5,
    borderColor: '#374151',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomWidth: 0,
    position: 'absolute',
    top: 2,
    left: 3,
  },
  bellClapper: {
    width: 4,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 2,
    position: 'absolute',
    bottom: 2,
    left: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: 'relative',
    marginRight: 10,
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#6B7280',
    position: 'absolute',
    top: 1,
    left: 1,
  },
  searchHandle: {
    width: 7,
    height: 2.5,
    backgroundColor: '#6B7280',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 1,
    right: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '400',
  },
  filtersContainer: {
    maxHeight: 44,
  },
  filtersContent: {
    gap: 10,
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  filterButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterIcon: {
    width: 16,
    height: 16,
    position: 'relative',
    marginRight: 6,
  },
  filterLine1: {
    width: 12,
    height: 2.5,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  filterLine2: {
    width: 8,
    height: 2.5,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    position: 'absolute',
    top: 7,
    left: 4,
  },
  filterLine3: {
    width: 10,
    height: 2.5,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    position: 'absolute',
    top: 12,
    left: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  filterTextOutline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  tagShape: {
    width: 12,
    height: 12,
    borderWidth: 2.5,
    borderColor: '#4B5563',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  locationIconSmall: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  locationPinSmall: {
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderColor: '#4B5563',
    borderRadius: 5,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 1,
    left: 3,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  bottomSpacer: {
    height: 100, // Espacio adicional al final para evitar que choque con el menú
  },
});

export default OpportunitiesScreen;