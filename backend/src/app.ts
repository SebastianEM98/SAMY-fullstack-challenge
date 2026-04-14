import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { corsOptions } from './config/cors';
import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';

export const createApp = () => {
    const app = express();

    // Security and parsing
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json());


    // Routes
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    return app;
};