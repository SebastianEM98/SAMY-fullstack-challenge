import { prisma } from '../../config/prisma';
import { CreatePostDto, PostId, UpdatePostDto } from './posts.types';

export const postsRepository = {
    
    async create(dto: CreatePostDto) {
        return prisma.post.create({
            data: dto,
            include: { author: true },
        });
    },

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { author: true },
            }),
            prisma.post.count(),
        ]);

        return {
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async findById(id: PostId) {
        return prisma.post.findUnique({
            where: { id },
            include: { author: true },
        });
    },

    async update(id: PostId, dto: UpdatePostDto) {
        return prisma.post.update({
            where: { id },
            data: dto,
            include: { author: true },
        });
    },

    async delete(id: PostId) {
        return prisma.post.delete({
            where: { id },
        });
    },
};