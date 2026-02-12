// useAplyToWork.ts
import { applyToWorkFn, getApplicationsByWorkFn, getMyApplicationsFn } from "@/services/aplications/aplicationsWorks";
import { useMutation, useQuery } from "@tanstack/react-query";

// Hook para postularse a un trabajo
export const useApplyToWork = () => {
    const applyToWorkMutation = useMutation({
        mutationFn: (workData: { workerId: string; workId: string }) => applyToWorkFn(workData),
        onSuccess: (data) => {
        },
        onError: (error) => {
        }
    });

    return { applyToWorkMutation };
};

// Hook separado para obtener postulados
export const useGetApplicationsByWork = (workId: string) => {
    return useQuery({
        queryKey: ['applicationsByWork', workId],
        queryFn: () => getApplicationsByWorkFn(workId),
        enabled: !!workId,
    });
};

//hook para obtener las postulaciones de un usuario logueado
export const useGetMyApplicationsJobsByUser = () => {
    return useQuery({
        queryKey: ['myApplications'],
        queryFn: () => getMyApplicationsFn(),
    });
}