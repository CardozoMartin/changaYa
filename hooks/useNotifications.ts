import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserNotificationsFn,
  getUnreadNotificationsFn,
  getNotificationStatsFn,
  markNotificationAsReadFn,
  markAllNotificationsAsReadFn,
  deleteNotificationFn,
  cleanOldNotificationsFn,
} from "@/services/notifications/notifications.services";

// Hook para obtener todas las notificaciones
export const useNotifications = (limit?: number) => {
  return useQuery({
    queryKey: ['notifications', limit],
    queryFn: () => getUserNotificationsFn(limit),
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Refetch cada 60 segundos
  });
};

// Hook para obtener notificaciones no leídas
export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: getUnreadNotificationsFn,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refetch automático cada minuto
  });
};

// Hook para obtener estadísticas
export const useNotificationStats = () => {
  return useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: getNotificationStatsFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para marcar notificación como leída
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsReadFn(id),
    onSuccess: () => {
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
    },
  });
};

// Hook para marcar todas como leídas
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsReadFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
    },
  });
};

// Hook para eliminar notificación
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotificationFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
    },
  });
};

// Hook para limpiar notificaciones antiguas
export const useCleanOldNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (days: number = 30) => cleanOldNotificationsFn(days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
    },
  });
};
