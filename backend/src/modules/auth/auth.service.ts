import { reqresClient } from '../../config/reqresClient';

interface LoginResult {
    token: string;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResult> {
        try {
            const { data } = await reqresClient.post('/login', { email, password });
            return { token: data.token };

        } catch (error: any) {
            const message = error.response?.data?.error || 'Invalid credentials';
            const err = new Error(message) as any;
            err.statusCode = error.response?.status || 401;
            throw err;
        }
    },
};