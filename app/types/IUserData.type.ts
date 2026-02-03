export interface IUserCreate {
    fullName: string;
    email: string;
    password: string;
   
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileCompleted?: boolean;
  acceptTerms?: boolean;
  imageProfile?: string;
  description?: string;
  hability?: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface IUserUpdate {
    fullName?: string;
    email?: string;
    address?: string;
    phone?: string;
    password?: string;
    imageProfile?: string;
    codeVerification?: string;
    hability?: string[];
    description?: string;
}

// Para evitar la advertencia de expo-router (dentro de `app/`), exportamos un componente por defecto no operativo
// Este archivo contiene solo tipos; el componente por defecto no afecta la lógica de la app.
export default function _IUserDataTypePage() {
  return null as any;
} 