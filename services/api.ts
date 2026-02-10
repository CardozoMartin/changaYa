import { useAuthSessionStore } from "@/store/authSessionStore";
import axios from "axios";

// Usar la URL pública de EXPO si está disponible (facilita cambios sin editar el código)
const BASE_URL ="https://6766-186-124-17-221.ngrok-free.app/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // timeout de 15s para detectar rápido errores de red
});

// Interceptor de request: agregar token si existe
api.interceptors.request.use((config) => {
  try {
    const token = useAuthSessionStore.getState().token;
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('[api] Error al leer token del store', err);
  }
  return config;
});

// Interceptor de response: normalizar errores de red para mensajes consistentes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si no hay response es un error de red (timeout, DNS, TLS, CORS, etc.)
    if (!error.response) {
      console.error('[api] Network or CORS error:', error.message);
      const err: any = new Error(error.message || 'Network Error');
      err.response = undefined;
      return Promise.reject(err);
    }

    // Para errores con respuesta del servidor, devolver tal cual para manejo posterior
    return Promise.reject(error);
  }
);

export default api;