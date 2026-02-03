import { applyToWorkFn } from "@/services/aplications/aplicationsWorks";
import { useMutation } from "@tanstack/react-query";


export const useAplyToWork = ()=>{

    //hook para postularse a un trabajo
    const applyToWorkMutation = useMutation({
        mutationFn: (workData: { workerId: string; workId: string }) => applyToWorkFn(workData),
        onSuccess: (data) => {},
        onError: (error) => {
           
        }
    });

    return {applyToWorkMutation};
   
}