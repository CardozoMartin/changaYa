import  api from "../api";
import { ICreateRatingDTO } from "@/app/types/IRatingData.Types";

export const postRatingFn = async (ratingData: ICreateRatingDTO): Promise<{ message: string }> => {
    try {
        const res = await api.post(`/ratings/`, ratingData);
        return res.data;
    } catch (error) {
        throw error;
    }
}