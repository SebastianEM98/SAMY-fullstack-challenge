import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Prevents leaking stack traces in production
    const response =
        process.env.NODE_ENV === 'development'
            ? { error: message, stack: err.stack }
            : { error: message };

    res.status(statusCode).json(response);
};