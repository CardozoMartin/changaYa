// Tipos para el sistema de notificaciones
export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedModel?: 'Work' | 'Application' | 'Rating';
  relatedId?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type NotificationType =
  | 'new_application'
  | 'application_accepted'
  | 'application_rejected'
  | 'application_withdrawn'
  | 'new_rating'
  | 'report_received'
  | 'work_confirmation'
  | 'reminder'
  | 'profile_incomplete';

export interface INotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface INotificationResponse {
  ok: boolean;
  data?: INotification[] | INotification | INotificationStats;
  message?: string;
}
