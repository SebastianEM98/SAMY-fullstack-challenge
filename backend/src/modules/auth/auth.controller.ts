import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';

const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

export const authController = {

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const parsed = loginSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: z.treeifyError(parsed.error)
                });
                return;
            }

            const { email, password } = parsed.data;
            const { token } = await authService.login(email, password);

            // Cookie httpOnly
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24, // 24h
            });

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    },

    async logout(_req: Request, res: Response): Promise<void> {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    },
};