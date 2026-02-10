
import { IUserUpdate } from "@/app/types/IUserData.type";
import { acceptTermsAndConditionsFn, completeUserProfileFn, getProfileDataFn, postAuthGoogleLoginFn, postAuthLoginFn, postAuthRegisterFn, verifyAccountFn } from "@/services/auth/auth.services";
import { useAuthSessionStore } from "@/store/authSessionStore";
import { useMutation, useQuery } from "@tanstack/react-query";
interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  // otros campos que tenga tu JWT
}

//ahora vamos hacer con tquery para registar el usaurio
export const useAuthRegister = () => {
  return useMutation({
    mutationFn: postAuthRegisterFn,
    onSuccess: (data) => {
      console.log('Usuario registrado con éxito:', data);
    },
    onError: (error: any) => {
      console.error('Error al registrar:', error);
    },
  });
};

//hook para verificar la cuenta con el codigo y id
export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: ({ code }: { code: string }) => verifyAccountFn(code),
    onSuccess: (data) => {
    },
    onError: (error: any) => {
    }
  });
}

//hook para hacer login
export const useAuthLogin = (options?: {
  onLoginSuccess?: (data: any) => void | Promise<void>;
}) => {
  return useMutation({
    mutationFn: ({ email, password, idGoogle }: { email?: string; password?: string; idGoogle?: string }) =>
      postAuthLoginFn(email, password, idGoogle),
    onSuccess: async (data) => {
      useAuthSessionStore.getState().setAuth(data.token, data.user);
     
      
      // ✅ Ejecutar callback personalizado si existe
      if (options?.onLoginSuccess) {
        await options.onLoginSuccess(data);
      }
    },
    onError: (error: any) => {
      // Mejor logging para entender la estructura del error
      const serverMessage = error?.response?.data?.message;
     
    },
  });
};
//hook para iniciar session con google
export const useAuthLoginWithGoogle = (options?: {
  onLoginSuccess?: (data: any) => void | Promise<void>;
}) => {
  console.log('🔧 [useAuthLoginWithGoogle] Hook inicializado con callback:', typeof options?.onLoginSuccess);
  return useMutation({
    mutationFn: (data: { fullName?: string; email?: string; address?: string; phone?: string; idGoogle?: string }) => {
      console.log('📡 [useAuthLoginWithGoogle] mutationFn ejecutada con data:', data);
      return postAuthGoogleLoginFn(data);
    },
    onSuccess: async (data) => {
      console.log('🎉 [useAuthLoginWithGoogle] onSuccess EJECUTADO!');
      console.log('🎉 [useAuthLoginWithGoogle] Data recibida:', data);
      
      useAuthSessionStore.getState().setAuth(data.token, data.user);
      console.log('✅ [useAuthLoginWithGoogle] Token guardado en store (Google):', data.token ? 'SÍ' : 'NO');
      console.log('✅ [useAuthLoginWithGoogle] Usuario guardado en store (Google):', data.user?.email);
      
      // ✅ Ejecutar callback personalizado si existe
      if (options?.onLoginSuccess) {
        console.log('🔄 [useAuthLoginWithGoogle] Ejecutando callback personalizado...');
        await options.onLoginSuccess(data);
        console.log('✅ [useAuthLoginWithGoogle] Callback finalizado');
      } else {
        console.log('⚠️ [useAuthLoginWithGoogle] NO HAY CALLBACK para ejecutar');
      }
    },
    onError: (error: any) => {
      console.error('❌ [useAuthLoginWithGoogle] onError EJECUTADO:', error.response?.data?.message || error.message);
      console.error('❌ [useAuthLoginWithGoogle] Detalles del error:', error.response?.data);
    },
  });
};

//hook para aceptar terminos y condiciones
export const useAcceptTermsAndConditions = () => {
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => acceptTermsAndConditionsFn(userId),
    onSuccess: (data) => {
      console.log('Términos y condiciones aceptados:', data);
    },
    onError: (error: any) => {
      console.error('Error al aceptar términos y condiciones:', error);
    },
  });
};

export const useCompleteUserProfile = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: IUserUpdate; id: string }) => completeUserProfileFn(data, id),
    onSuccess: (data) => {
      console.log('Perfil completado con éxito:', data);
    },
    onError: (error: any) => {
      // Log details for easier diagnosis
      console.error('Error al completar el perfil:', error?.message, error?.code, error?.response?.status, error?.response?.data);
    },
  });
};

//hook para obtener los datos del usaurio logueado mas los trabajos publicados y las postulaciones de trabajos que hizo
export const useGetProfileData = () => {
  return useQuery({
    queryKey: ['profileData'],
    queryFn: getProfileDataFn,
  })
}