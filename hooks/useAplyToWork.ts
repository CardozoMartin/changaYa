// useAplyToWork.ts
import { applyToWorkFn, getApplicationsByWorkFn } from "@/services/aplications/aplicationsWorks";
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