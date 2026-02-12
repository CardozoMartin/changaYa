import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUnreadNotifications } from '@/hooks/useNotifications';

interface NotificationBellProps {
  iconSize?: number;
  iconColor?: string;
  badgeColor?: string;
}

const NotificationBell = ({ 
  iconSize = 24, 
  iconColor = '#1E3A5F',
  badgeColor = '#EF4444'
}: NotificationBellProps) => {
  const router = useRouter();
  const { data: unreadData } = useUnreadNotifications();
  
  // Contar notificaciones no leídas
  const unreadCount = unreadData?.data?.length || 0;

  const handlePress = () => {
    router.push('/(tabs)/NotificationsScreen');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={unreadCount > 0 ? "notifications" : "notifications-outline"} 
        size={iconSize} 
        color={iconColor} 
      />
      
      {/* Badge de contador */}
      {unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default NotificationBell;
