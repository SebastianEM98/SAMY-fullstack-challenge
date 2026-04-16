import { apiClient } from '../apiClient';

interface LoginDto {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

export const authApi = {
    login: (dto: LoginDto) =>
        apiClient<LoginResponse>('/auth/login', {
            method: 'POST',
            body: dto,
        }),

    logout: () => apiClient('/auth/logout', { method: 'POST' }),
};