import axios from 'axios';
import { env } from './env';

export const reqresClient = axios.create({
    baseURL: 'https://reqres.in/api',
    headers: {
        'x-api-key': env.reqresApiKey,
    },
});