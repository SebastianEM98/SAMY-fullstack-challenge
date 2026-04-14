import { CorsOptions } from 'cors';
import { env } from './env';

const whitelist = [
    env.frontendUrl,
    'http://localhost:3000',   // Next.js local
].filter(Boolean) as string[];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {

        // Allows requests without Origin (Postman, curl, Lambda test) only in development
        if (!origin && env.nodeEnv === 'development' || env.nodeEnv === 'test') {
            return callback(null, true);
        }

        if (origin && whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};