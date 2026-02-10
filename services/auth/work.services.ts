import { IWorkData } from "@/app/types/IWorkData.types";
import api from "../api";

//funcion para obtener todos los trabajos
export const getAllWorksFn = async (): Promise<any[]> => {
    try {
        const res = await api.get('/works/');
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

//funcion para obtener los detalles de un trabajo por el id
export const getWorkDetailsByIdFn = async (workId: string): Promise<any> => {
    try {
        const res = await api.get(`/works/${workId}`);
        return res.data.data; 
    } catch (error) {
        throw error;
    }
}

//funcion para crear un trabajo
export const createWorkFn = async (workData: FormData): Promise<IWorkData> => {
    try {
        // ✅ Configuración especial para FormData
        const res = await api.post('/works/create', workData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data) => data, // No transformar FormData
        });
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

//funcion para saber si el usuario logueado tiene un trabajo activo
export const checkWorksActiveFn = async (): Promise<any> => {
    try {
    
        const res = await api.get('/works/isWorkOpen');
       
     
        return res.data.data;
    } catch (error: any) {
      
        throw error;
    }
}