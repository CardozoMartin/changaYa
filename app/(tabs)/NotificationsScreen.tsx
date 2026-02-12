import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications';
import { INotification } from '@/app/types/INotificationData.types';
import NotificationItem from '@/components/Notifications/NotificationItem';

const NotificationsScreen = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Hooks
  const { data: notificationsData, isLoading, refetch } = useNotifications(100);
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  // Datos
  const notifications: INotification[] = notificationsData?.data || [];
  
  // Filtrar según el tab activo
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Manejar click en notificación
  const handleNotificationPress = (notification: INotification) => {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navegar según el actionUrl o relatedModel
    if (notification.actionUrl) {
      // Aquí puedes manejar la navegación según la URL
      // Por ejemplo: router.push(notification.actionUrl);
    } else if (notification.relatedModel === 'Work' && notification.relatedId) {
      router.push({
        pathname: '/(tabs)/WorkDetailScreen',
        params: { id: notification.relatedId }
      });
    } else if (notification.relatedModel === 'Application' && notification.relatedId) {
      // Navegar a detalles de aplicación si existe esa pantalla
    }
  };

  // Manejar eliminación
  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar notificación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteNotification(id),
        },
      ]
    );
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      Alert.alert('No hay notificaciones', 'No tienes notificaciones sin leer');
      return;
    }

    Alert.alert(
      'Marcar todas como leídas',
      `¿Marcar las ${unreadCount} notificaciones como leídas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Marcar todas',
          onPress: () => markAllAsRead(),
        },
      ]
    );
  };

  // Manejar pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Renderizar item
  const renderItem = ({ item }: { item: INotification }) => (
    <NotificationItem
      notification={item}
      onPress={handleNotificationPress}
      onDelete={handleDelete}
    />
  );

  // Renderizar empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>
        {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
      </Text>
      <Text style={styles.emptyMessage}>
        {filter === 'unread' 
          ? 'Todas tus notificaciones están al día'
          : 'Aquí aparecerán tus notificaciones cuando las recibas'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
          disabled={isMarkingAll || unreadCount === 0}
        >
          {isMarkingAll ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Ionicons 
              name="checkmark-done" 
              size={24} 
              color={unreadCount > 0 ? "#3B82F6" : "#D1D5DB"} 
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas ({notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            No leídas ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de notificaciones */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Cargando notificaciones...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            filteredNotifications.length === 0 ? styles.emptyList : undefined
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  markAllButton: {
    padding: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#3B82F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
