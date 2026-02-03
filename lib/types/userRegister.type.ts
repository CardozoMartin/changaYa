export default interface UserRegister {
    fullName: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
}

export interface UserRegisterResponse {
    id: string;
    fullName: string;
    email: string;
    address: string;
    phone: string;
    role: 'worker' | 'employer' | 'both';
    createdAt: string;
}