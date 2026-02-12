import api from '../api';
import { INotification, INotificationStats } from '@/app/types/INotificationData.types';

// Obtener todas las notificaciones del usuario
export const getUserNotificationsFn = async (limit?: number): Promise<any> => {
  try {
    const url = limit ? `/notifications?limit=${limit}` : '/notifications';
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Obtener notificaciones no leídas
export const getUnreadNotificationsFn = async (): Promise<any> => {
  try {
    const res = await api.get('/notifications/unread');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Obtener estadísticas de notificaciones
export const getNotificationStatsFn = async (): Promise<any> => {
  try {
    const res = await api.get('/notifications/stats');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Marcar notificación como leída
export const markNotificationAsReadFn = async (id: string): Promise<any> => {
  try {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Marcar todas como leídas
export const markAllNotificationsAsReadFn = async (): Promise<any> => {
  try {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar notificación
export const deleteNotificationFn = async (id: string): Promise<any> => {
  try {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Limpiar notificaciones antiguas
export const cleanOldNotificationsFn = async (days: number = 30): Promise<any> => {
  try {
    const res = await api.delete(`/notifications/clean/old?days=${days}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
