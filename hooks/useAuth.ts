
import { IUserUpdate } from "@/app/types/IUserData.type";
import { acceptTermsAndConditionsFn, completeUserProfileFn, getFullProfileByIdFn, getProfileDataFn, postAuthGoogleLoginFn, postAuthLoginFn, postAuthRegisterFn, verifyAccountFn } from "@/services/auth/auth.services";
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
    },
    onError: (error: any) => {
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
  return useMutation({
    mutationFn: (data: { fullName?: string; email?: string; address?: string; phone?: string; idGoogle?: string }) => {

      return postAuthGoogleLoginFn(data);
    },
    onSuccess: async (data) => {
      useAuthSessionStore.getState().setAuth(data.token, data.user);
      
      if (options?.onLoginSuccess) {
        await options.onLoginSuccess(data);
      }
    },
    onError: (error: any) => {
    },
  });
};


//hook para aceptar terminos y condiciones
export const useAcceptTermsAndConditions = () => {
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => acceptTermsAndConditionsFn(userId),
    onSuccess: (data) => {
    },
    onError: (error: any) => {
    },
  });
};

export const useCompleteUserProfile = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: IUserUpdate; id: string }) => completeUserProfileFn(data, id),
    onSuccess: (data) => {
    },
    onError: (error: any) => {
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

//hook para obtener el perfil full del usuario para ver su perfil
export const useGetFullProfileById = (id: string) => {
  return useQuery({
    queryKey: ['fullProfile', id],
    queryFn: () => getFullProfileByIdFn(id),
    enabled: !!id, // Solo ejecutar si el ID está disponible
  })
}
