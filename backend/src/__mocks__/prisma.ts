export const PrismaClient = jest.fn().mockImplementation(() => ({
    user: {
        upsert: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
    post: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    $transaction: jest.fn(),
}));