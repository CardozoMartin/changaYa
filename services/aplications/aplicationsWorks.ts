import api from '../api';

interface IWorkData {
  workerId: string;
  workId: string;
}

interface ISelectApplicantData {
  workId: string;
  workerId: string;
  applicationId: string;
}

//funcion pra postularse a un trabajo
export const applyToWorkFn = async (workData:IWorkData): Promise<any> => {
    try {
        const res = await api.post(`/applications/`, workData);
        return res.data;
    } catch (error) {
        throw error;
    }
}

//funcion para obtener todos los postulados de un trabajo
export const getApplicationsByWorkFn = async (workId: string): Promise<any> => {
    try {
        const res = await api.get(`/applications/work/${workId}`);
        return res.data.data;
    } catch (error: any) {
        throw error;
    }
}

//funcion para seleccionar un trabajador para un trabajo
export const selectApplicantForWorkFn = async (data: ISelectApplicantData): Promise<any> => {
    try {
        const res = await api.patch(`/works/${data.workId}/select-worker`, {
            workerId: data.workerId,
            applicationId: data.applicationId
        });
        return res.data;
    } catch (error: any) {
        throw error;
    }
}