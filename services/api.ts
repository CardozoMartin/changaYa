import { useAuthSessionStore } from "@/store/authSessionStore";
import axios from "axios";

const api = axios.create({
  baseURL: "https://6a420039deea.ngrok-free.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

//vamos agregar un intercepetor de Rquest - para aregar el token y poder verificar datos en el backend
api.interceptors.request.use((config => {
  const token = useAuthSessionStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}));

export default api;