import { queryClient } from "@/lib/queryClient";
import { createWorkFn, getAllWorksFn, getWorkDetailsByIdFn } from "@/services/auth/work.services";
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