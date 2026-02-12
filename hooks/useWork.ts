import { queryClient } from "@/lib/queryClient";
import { getUserByIdFn } from "@/services/auth/auth.services";
import { checkWorksActiveFn, createWorkFn, getAllWorksFn, getWorkDetailsByIdFn } from "@/services/auth/work.services";
import { selectApplicantForWorkFn } from "@/services/aplications/aplicationsWorks";
import { useMutation, useQuery } from "@tanstack/react-query";




//hook para obtener todos los trabajos
export const useWork = () => {
    return useQuery({
        queryKey: ['works'],
        queryFn: getAllWorksFn,
    });
}

//hook para obtener los detalles de un trabajo por id
export const useWorkDetails = (workId: string) => {
    return useQuery({
        queryKey: ['workDetails', workId],
        queryFn: () => getWorkDetailsByIdFn(workId),
        enabled: !!workId,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}

//hook para crear un trabajo
export const useCreateWork = () => {
    return useMutation({
        mutationFn: createWorkFn,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['works'] });
        },
        onError: (error) => {
        }
    });
}

//hook para saber si el usuario logueado tiene un trabajo activo
export const useCheckWorksActive = () => {
    return useQuery({
        queryKey: ['checkWorksActive'],
        queryFn: checkWorksActiveFn,
        enabled: false, // 🔥 MUY IMPORTANTE: No ejecutar automáticamente
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}

//hook para obtener la informacion de un usuario por su id
export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: ['getUserById', id],
        queryFn: () => getUserByIdFn(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}

//hook para seleccionar un trabajador para un trabajo
export const useSelectApplicantForWork = () => {
    return useMutation({
        mutationFn: selectApplicantForWorkFn,
        onSuccess: (data) => {
            // Invalidar queries relacionadas para refrescar datos
            queryClient.invalidateQueries({ queryKey: ['works'] });
            queryClient.invalidateQueries({ queryKey: ['applicationsByWork'] });
            queryClient.invalidateQueries({ queryKey: ['checkWorksActive'] });
        },
        onError: (error: any) => {
            // Error al seleccionar trabajador
        }
    });
}