import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            token?: string;
        }
    }
}


export const authenticate = (req: Request, res: Response, next: NextFunction): void => {

    // The token is searched in cookies, then in the Authorization header
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: no token provided' });
        return;
    }

    // JWT is not validated because ReqRes only provides a fake token, so we just check for its existence

    req.token = token;
    next();
};