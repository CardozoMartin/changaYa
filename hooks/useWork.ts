import { queryClient } from "@/lib/queryClient";
import { getUserByIdFn } from "@/services/auth/auth.services";
import { checkWorksActiveFn, createWorkFn, getAllWorksFn, getWorkDetailsByIdFn } from "@/services/auth/work.services";
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
            console.log('Trabajo creado con éxito:', data);
            queryClient.invalidateQueries({ queryKey: ['works'] });
        },
        onError: (error) => {
            console.error('Error al crear el trabajo:', error);
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