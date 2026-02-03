import  api  from '../api'

interface IWorkData {
  workerId: string;
  workId: string;
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