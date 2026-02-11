import {
  IUserCreate,
  IUserUpdate,
  LoginResponse,
} from "@/app/types/IUserData.type";
import { UserRegisterResponse } from "@/lib/types/userRegister.type";
import api from "../api";

//funcion para registrar un usaurio
export const postAuthRegisterFn = async (
  data: IUserCreate,
): Promise<UserRegisterResponse> => {
  try {
    const res = await api.post("/users/register", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//funcion para verificar la cuenta con el codigo
export const verifyAccountFn = async (
  code: string,
): Promise<{ message: string }> => {
  try {
    const res = await api.put(`/users/verifyaccount`, {
      codeVerification: code,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

//funcion para aceptar los terminos y condiciones
export const acceptTermsAndConditionsFn = async (
  userId: string,
): Promise<{ message: string }> => {
  try {
    const res = await api.put(`/users/changeterms/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//funcion para completar el perfil del usuario
export const completeUserProfileFn = async (
  data: IUserUpdate,
  id: string,
): Promise<{ message: string }> => {
  try {
    // In React Native + FormData it's helpful to explicitly set multipart header
    const res = await api.put(`/users/completeprofile/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(
      "[auth.services] completeUserProfileFn error ->",
      error.message,
      error?.toJSON ? error.toJSON() : error,
    );
    throw error;
  }
};

//funcion para el login del usuario con contraseña y email

export const postAuthLoginFn = async (
  email?: string,
  password?: string,
  idGoogle?: string,
): Promise<LoginResponse> => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
      idGoogle,
    });
    console.log("Respuesta del login:", res.data);
    return res.data;
  } catch (error: any) {
    // Log full error for debugging
    console.error('[postAuthLoginFn] Error completo:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });
    // Normalizar mensaje para que los handlers puedan leerlo de manera consistente
    const serverMessage = error?.response?.data?.message ?? error?.message ?? 'Error desconocido en login';
    const normalized: any = new Error(serverMessage);
    normalized.response = error?.response;
    throw normalized;
  }
};
export const postAuthGoogleLoginFn = async (data: {
  fullName?: string;
  email?: string;
  address?: string;
  phone?: string;
  idGoogle?: string;
}): Promise<LoginResponse> => {
  try {
    console.log('[postAuthGoogleLoginFn] Enviando datos:', data);
    const res = await api.post("/users/googlelogin", data);
    console.log('[postAuthGoogleLoginFn] Respuesta del servidor:', res.data);
    
    // ✅ Extraer data.data porque el backend envuelve la respuesta
    if (res.data.success && res.data.data) {
      console.log('[postAuthGoogleLoginFn] Token y usuario extraídos correctamente');
      return res.data.data; // Retornar solo { token, user }
    }
    
    throw new Error('Respuesta inválida del servidor');
  } catch (error: any) {
    console.error('[postAuthGoogleLoginFn] Error:', error.message);
    throw error;
  }
};

//funcion para obtener los datos del usaurio logueado mas los trabajos publicados y las postulaciones de trabajos que hizo
export const getProfileDataFn = async (): Promise<any> => {
  try {
    const res = await api.get("/users/profile/details");
    return res.data;
  } catch (error) {
    throw error;
  }
};
//funcion para obtener los datos de un usuario por el id
export const getUserByIdFn = async (id: string): Promise<any> => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
