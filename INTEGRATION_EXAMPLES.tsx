// EJEMPLO DE INTEGRACIÓN DE LA CAMPANITA EN PROFILESCREEN
// Este es un ejemplo de cómo modificar el ProfileScreen existente

import NotificationBell from "@/components/Notifications/NotificationBell";
// ... otros imports ...

const ProfileScreen = () => {
  // ... resto del código ...

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header CON CAMPANITA */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        
        {/* Contenedor de acciones del header */}
        <View style={styles.headerActions}>
          {/* CAMPANITA DE NOTIFICACIONES */}
          <NotificationBell iconColor="#fff" iconSize={24} />
          
          {/* Botón de configuración */}
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Resto del código del perfil... */}
    </ScrollView>
  );
};

// Agregar estos estilos:
const styles = StyleSheet.create({
  // ... estilos existentes ...
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Espacio entre campanita y settings
  },
});

// ============================================
// EJEMPLO DE INTEGRACIÓN EN HOMESCREEN
// ============================================

import NotificationBell from "@/components/Notifications/NotificationBell";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Header con logo Y CAMPANITA */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            {/* Logo existente */}
            <View style={styles.iconBackground}>
              <Ionicons name="hand-left-outline" size={60} color="#FFF" />
            </View>
            <View style={styles.badge}>
              <Ionicons name="flash" size={16} color="#1E3A5F" />
            </View>
          </View>
          
          {/* CAMPANITA en la esquina */}
          <NotificationBell iconSize={26} iconColor="#1E3A5F" />
        </View>

        {/* Resto del contenido... */}
      </View>
    </SafeAreaView>
  );
};

// Modificar estilos del header:
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Añadir esto
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // ... resto de estilos
});

// ============================================
// EJEMPLO DE USO EN CUALQUIER SCREEN
// ============================================

import NotificationBell from "@/components/Notifications/NotificationBell";

// Opción 1: Header simple con campanita
<View style={styles.header}>
  <Text style={styles.title}>Mi Pantalla</Text>
  <NotificationBell />
</View>

// Opción 2: Header con múltiples botones
<View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>
  
  <Text style={styles.title}>Mi Pantalla</Text>
  
  <View style={styles.headerActions}>
    <NotificationBell iconSize={22} />
    <TouchableOpacity onPress={handleSearch}>
      <Ionicons name="search" size={22} color="#000" />
    </TouchableOpacity>
  </View>
</View>

// Opción 3: Header con fondo de color
<View style={[styles.header, { backgroundColor: '#1142d4' }]}>
  <Text style={styles.title}>Mi Pantalla</Text>
  <NotificationBell 
    iconColor="#FFFFFF"      // Ícono blanco
    badgeColor="#FFD700"     // Badge dorado
    iconSize={24} 
  />
</View>

// ============================================
// NAVEGACIÓN PROGRAMÁTICA A NOTIFICACIONES
// ============================================

import { useRouter } from 'expo-router';

const MyComponent = () => {
  const router = useRouter();

  const handleViewNotifications = () => {
    router.push('/(tabs)/NotificationsScreen');
  };

  return (
    <TouchableOpacity onPress={handleViewNotifications}>
      <Text>Ver todas las notificaciones</Text>
    </TouchableOpacity>
  );
};

// ============================================
// USO AVANZADO: MOSTRAR CONTADOR EN TAB BAR
// ============================================

import { useUnreadNotifications } from '@/hooks/useNotifications';

const TabBar = () => {
  const { data: unreadData } = useUnreadNotifications();
  const unreadCount = unreadData?.data?.length || 0;

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tab}>
        <Ionicons name="home" size={24} />
        <Text>Inicio</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tab}>
        <View style={styles.iconWithBadge}>
          <Ionicons name="notifications" size={24} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Text>Notificaciones</Text>
      </TouchableOpacity>
    </View>
  );
};
