import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { corsOptions } from './config/cors';
import { env } from './config/env';

export const createApp = () => {
    const app = express();

    // Security and parsing
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json());

    
    // Routes
    

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    return app;
};