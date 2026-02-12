# Sistema de Notificaciones - ChangaYa

## 📋 Descripción

Sistema completo de notificaciones in-app que incluye:
- Campanita con contador de notificaciones no leídas
- Pantalla de listado de notificaciones
- Filtros (Todas / No leídas)
- Marcar como leída individual o todas
- Eliminar notificaciones
- Auto-refresh cada minuto
- Pull to refresh

## 🏗️ Estructura de Archivos

```
changaYa/
├── app/
│   └── types/
│       └── INotificationData.types.ts      # Tipos TypeScript
│   └── (tabs)/
│       └── NotificationsScreen.tsx         # Pantalla principal
├── components/
│   └── Notifications/
│       ├── NotificationBell.tsx            # Campanita para headers
│       └── NotificationItem.tsx            # Item de notificación
├── hooks/
│   └── useNotifications.ts                 # Hooks de React Query
└── services/
    └── notifications/
        └── notifications.services.ts       # Servicios API
```

## 🚀 Integración

### 1. Agregar la campanita en un Header

```tsx
import NotificationBell from '@/components/Notifications/NotificationBell';

// En tu componente de header o screen:
<View style={styles.header}>
  <Text style={styles.title}>Mi App</Text>
  <NotificationBell iconSize={24} iconColor="#1E3A5F" />
</View>
```

### 2. Ejemplo de uso en HomeScreen

```tsx
import NotificationBell from '@/components/Notifications/NotificationBell';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con campanita */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inicio</Text>
        <NotificationBell />
      </View>
      
      {/* Resto del contenido */}
    </SafeAreaView>
  );
};
```

### 3. Ejemplo de uso en ProfileScreen

```tsx
import NotificationBell from '@/components/Notifications/NotificationBell';

const ProfileScreen = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Mi Perfil</Text>
      <View style={styles.headerActions}>
        <NotificationBell iconColor="#FFFFFF" />
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## 📱 Características

### NotificationBell (Campanita)

**Props:**
- `iconSize?: number` - Tamaño del ícono (default: 24)
- `iconColor?: string` - Color del ícono (default: '#1E3A5F')
- `badgeColor?: string` - Color del badge contador (default: '#EF4444')

**Comportamiento:**
- Muestra contador de notificaciones no leídas
- Auto-refresh cada 60 segundos
- Click navega a NotificationsScreen

### NotificationsScreen (Pantalla Principal)

**Funcionalidades:**
- Lista todas las notificaciones
- Filtros: Todas / No leídas
- Marcar individual como leída al hacer click
- Marcar todas como leídas (botón superior derecho)
- Eliminar notificación individual (botón X)
- Pull to refresh
- Auto-refresh cada 60 segundos
- Estados: Loading, Empty, Error

### Tipos de Notificaciones

El sistema soporta los siguientes tipos automáticamente:

- `new_application` - Nueva postulación recibida
- `application_accepted` - Postulación aceptada
- `application_rejected` - Postulación rechazada
- `new_rating` - Nueva calificación recibida
- `report_received` - Reporte recibido
- `work_confirmation` - Confirmación de trabajo pendiente
- `reminder` - Recordatorios
- `profile_incomplete` - Perfil incompleto

Cada tipo tiene su propio ícono y color según prioridad.

## 🎨 Personalización

### Cambiar colores del badge

```tsx
<NotificationBell 
  iconColor="#FFFFFF" 
  badgeColor="#10B981" 
/>
```

### Cambiar intervalo de auto-refresh

En `hooks/useNotifications.ts`:

```typescript
refetchInterval: 30 * 1000, // 30 segundos en vez de 60
```

## 🔄 Flujo de Datos

1. **Backend** crea notificaciones vía `NotificationService`
2. **Frontend** las consume vía hooks de React Query
3. **Auto-refresh** cada minuto mantiene datos actualizados
4. **Cache** de React Query optimiza rendimiento
5. **Invalidación** automática al marcar/eliminar

## 📊 Hooks Disponibles

```typescript
// Obtener todas las notificaciones
const { data, isLoading, refetch } = useNotifications(50);

// Obtener solo no leídas
const { data: unread } = useUnreadNotifications();

// Estadísticas
const { data: stats } = useNotificationStats();

// Marcar como leída
const { mutate: markAsRead } = useMarkAsRead();

// Marcar todas como leídas
const { mutate: markAllAsRead } = useMarkAllAsRead();

// Eliminar
const { mutate: deleteNotification } = useDeleteNotification();
```

## 🎯 Navegación desde Notificaciones

Al hacer click en una notificación, se puede navegar automáticamente según el `relatedModel`:

- **Work** → Navega a WorkDetailScreen
- **Application** → Navega a detalles de aplicación
- **Custom** → Usa el campo `actionUrl`

## ⚙️ Configuración API

Asegúrate de que tu backend esté corriendo en la URL configurada en `services/api.ts`:

```typescript
const BASE_URL = "https://tu-backend.com/api/v1";
```

Las rutas del backend deben estar en:
```
/notifications          - GET (todas)
/notifications/unread   - GET (no leídas)
/notifications/stats    - GET (estadísticas)
/notifications/:id/read - PATCH (marcar como leída)
/notifications/read-all - PATCH (marcar todas)
/notifications/:id      - DELETE (eliminar)
```

## 🐛 Troubleshooting

**Las notificaciones no se actualizan:**
- Verifica que el token de autenticación esté correcto en `api.ts`
- Revisa la consola del backend para errores

**El contador no aparece:**
- Asegúrate de que `useUnreadNotifications()` está retornando datos
- Verifica que el hook esté dentro de un QueryClientProvider

**Errores de navegación:**
- Confirma que las rutas existen en tu app
- Ajusta la lógica de navegación en `handleNotificationPress`

## 📝 Notas

- El sistema usa React Query para cache y sincronización
- Las notificaciones se borran automáticamente después de 90 días (configurado en backend)
- El auto-refresh está optimizado para no consumir batería excesiva
- Todos los componentes están tipados con TypeScript
