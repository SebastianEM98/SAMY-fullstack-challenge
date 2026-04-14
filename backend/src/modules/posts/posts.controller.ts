import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { postsService } from './posts.service';
import { PostId } from './posts.types';

const createPostSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    authorUserId: z.number().int().positive('Author user ID must be a positive integer'),
});

const updatePostSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    content: z.string().min(10, 'Content must be at least 10 characters').optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided' }
);

const pageSchema = z.coerce.number().int().positive().default(1);
const limitSchema = z.coerce.number().int().positive().max(100).default(10);
const idSchema: z.ZodType<PostId> = z.cuid('Invalid post ID');

export const postsController = {

    // POST /posts
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = createPostSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: parsed.error.issues.map((i) => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                });
                return;
            }

            const post = await postsService.create(parsed.data);
            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    },
};