import { postRatingFn } from "@/services/rating/apiRating";
import { useMutation } from "@tanstack/react-query"
import { ICreateRatingDTO } from "@/app/types/IRatingData.Types";


//hook para crear el rating
export const usePostRating = ( )=>{
    return useMutation({
        mutationFn: (ratingData: ICreateRatingDTO ) => postRatingFn(ratingData),
        onSuccess: (data) => {
        },
        onError: (error) => {
        }
    });
}