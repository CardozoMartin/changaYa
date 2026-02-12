import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INotification, NotificationType } from '@/app/types/INotificationData.types';
import { useRouter } from 'expo-router';

interface NotificationItemProps {
  notification: INotification;
  onPress?: (notification: INotification) => void;
  onDelete?: (id: string) => void;
}

const NotificationItem = ({ notification, onPress, onDelete }: NotificationItemProps) => {
  const router = useRouter();

  // Iconos según tipo de notificación
  const getNotificationIcon = (type: NotificationType): string => {
    const icons: Record<NotificationType, string> = {
      'new_application': 'people',
      'application_accepted': 'checkmark-circle',
      'application_rejected': 'close-circle',
      'application_withdrawn': 'return-down-back',
      'new_rating': 'star',
      'report_received': 'warning',
      'work_confirmation': 'clipboard',
      'reminder': 'alarm',
      'profile_incomplete': 'person-circle',
    };
    return icons[type] || 'notifications';
  };

  // Colores según prioridad
  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      'high': '#EF4444',
      'medium': '#F59E0B',
      'low': '#10B981',
    };
    return colors[priority] || colors.medium;
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress(notification);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Indicador de no leído */}
      {!notification.isRead && <View style={styles.unreadIndicator} />}

      {/* Icono */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: `${getPriorityColor(notification.priority)}15` }
      ]}>
        <Ionicons
          name={getNotificationIcon(notification.type) as any}
          size={24}
          color={getPriorityColor(notification.priority)}
        />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>
      </View>

      {/* Botón eliminar */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  unreadContainer: {
    backgroundColor: '#F0F9FF',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#3B82F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default NotificationItem;
