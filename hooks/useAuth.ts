
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
export const useAuthLogin = () => {
  return useMutation({
    mutationFn: ({ email, password, idGoogle }: { email?: string; password?: string; idGoogle?: string }) =>
      postAuthLoginFn(email, password, idGoogle),
    onSuccess: (data) => {
      useAuthSessionStore.getState().setAuth(data.token, data.user);
      console.warn('useAuthLogin onSuccess - full data:', data);
      console.warn('useAuthLogin - user keys:', Object.keys(data.user || {}));
    },
    onError: (error: any) => {
      console.error('Error en login:', error.response?.data?.message);
    },
  });
};
//hook para iniciar session con google
export const useAuthLoginWithGoogle = () => {
  return useMutation({
    mutationFn: (data: { fullName?: string; email?: string; address?: string; phone?: string; idGoogle?: string }) =>
      postAuthGoogleLoginFn(data),
    onSuccess: (data) => {
      useAuthSessionStore.getState().setAuth(data.token, data.user);
      console.log('✅ Token guardado en store:', data.token ? 'SÍ' : 'NO');
      console.log('✅ Usuario guardado en store:', data.user?.email);
      console.log('📊 Datos completos recibidos:', {
        token: data.token?.substring(0, 20) + '...',
        userId: data.user?.id,
        email: data.user?.email,
        profileCompleted: data.user?.profileCompleted,
        acceptTerms: data.user?.acceptTerms,
      });
    },
    onError: (error: any) => {
      console.error('❌ Error en login con Google:', error.response?.data?.message || error.message);
      console.error('❌ Detalles del error:', error.response?.data);
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