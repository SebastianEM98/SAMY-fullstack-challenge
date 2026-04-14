import { prisma } from '../../config/prisma';
import { ReqResUser } from './users.types';

export const usersRepository = {

    async save(user: ReqResUser) {
        return prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                avatar: user.avatar,
            },
            create: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                avatar: user.avatar,
            },
        });
    },

    async findAll() {
        return prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: number) {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async deleteById(id: number) {
        return prisma.user.delete({
            where: { id },
        });
    },
};