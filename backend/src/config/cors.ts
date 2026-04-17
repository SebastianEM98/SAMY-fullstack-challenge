import { CorsOptions } from 'cors';
import { env } from './env';

const whitelist = [
    env.frontendUrl,
    'http://localhost:3000',   // Next.js local
].filter(Boolean) as string[];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {

        // Allows requests without Origin (Postman, curl, Lambda test) only in development
        if (!origin) {
            return callback(null, true);
        }

        if (whitelist.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};