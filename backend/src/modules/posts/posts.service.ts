import { postsRepository } from './posts.repository';
import { CreatePostDto, PostId, UpdatePostDto } from './posts.types';
import { prisma } from '../../config/prisma';

export const postsService = {
    
    async create(dto: CreatePostDto) {
        // Checks that the author exists locally
        const author = await prisma.user.findUnique({
            where: { id: dto.authorUserId },
        });

        if (!author) {
            const err = new Error(
                'Author not found locally. Import the user first.'
            ) as any;
            err.statusCode = 404;
            throw err;
        }

        return postsRepository.create(dto);
    },

    async getAll(page: number = 1, limit: number = 10) {
        return postsRepository.findAll(page, limit);
    },

    async getById(id: PostId) {
        const post = await postsRepository.findById(id);

        if (!post) {
            const err = new Error('Post not found') as any;
            err.statusCode = 404;
            throw err;
        }

        return post;
    },
};