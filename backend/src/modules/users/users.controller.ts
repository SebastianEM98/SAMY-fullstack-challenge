import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { usersService } from './users.service';
import { ReqResPage, ReqResUserId } from './users.types';

const pageSchema: z.ZodType<ReqResPage> = z.coerce.number().int().positive().default(1);
const idSchema: z.ZodType<ReqResUserId> = z.coerce.number().int().positive();

export const usersController = {

    // GET /users/reqres?page=1
    async getReqResUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = pageSchema.parse(req.query.page ?? 1);
            const result = await usersService.getReqResUsers(page);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // POST /users/import/:id
    async importUser(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = idSchema.safeParse(req.params.id);

            if (!parsed.success) {
                res.status(400).json({ error: 'Invalid user ID' });
                return;
            }

            const user = await usersService.importUser(parsed.data);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    },
};