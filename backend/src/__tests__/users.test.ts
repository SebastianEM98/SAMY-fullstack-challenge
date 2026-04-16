import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { reqresClient } from '../config/reqresClient';


// Mock the prisma config module
jest.mock('../config/prisma', () => ({
    prisma: {
        user: {
            upsert: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
        post: {
            create: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

// Mock the auth middleware so these tests don't depend on the token
jest.mock('../middleware/authenticate', () => ({
    authenticate: (_req: any, _res: any, next: any) => next(),
}));


jest.mock('../config/reqresClient', () => ({
    reqresClient: {
        post: jest.fn(),
        get: jest.fn(),
    },
}));


const mockedClient = reqresClient as jest.Mocked<typeof reqresClient>;
const mockedPrisma = prisma as any;

const app = createApp();

const mockReqResUser = {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
};

const mockLocalUser = {
    id: 1,
    email: 'george.bluth@reqres.in',
    firstName: 'George',
    lastName: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
};

beforeEach(() => {
    jest.clearAllMocks();
});


describe('GET /users/reqres', () => {
    it('should return paginated users from ReqRes', async () => {
        mockedClient.get.mockResolvedValueOnce({
            data: {
                page: 1,
                per_page: 6,
                total: 12,
                total_pages: 2,
                data: [mockReqResUser],
            },
        });

        const res = await request(app).get('/users/reqres?page=1');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('total', 12);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0]).toHaveProperty('id', 1);
    });

    it('should return 502 when ReqRes is unavailable', async () => {
        mockedClient.get.mockRejectedValueOnce(new Error('Network Error'));

        const res = await request(app).get('/users/reqres');

        expect(res.status).toBe(502);
        expect(res.body).toHaveProperty('error', 'Failed to fetch users from ReqRes');
    });
});


describe('GET /users/reqres/:id', () => {
    it('should return a user from ReqRes by id', async () => {
        mockedClient.get.mockResolvedValueOnce({
            data: { data: mockReqResUser },
        });

        const res = await request(app).get('/users/reqres/1');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('email', 'george.bluth@reqres.in');
        expect(res.body).toHaveProperty('first_name', 'George');
    });

    it('should return 404 when user does not exist in ReqRes', async () => {
        mockedClient.get.mockRejectedValueOnce({
            response: { status: 404 },
        });

        const res = await request(app).get('/users/reqres/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found in ReqRes');
    });

    it('should return 400 when id is invalid', async () => {
        const res = await request(app).get('/users/reqres/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid user ID');
    });
});


describe('POST /users/import/:id', () => {
    it('should import a user from ReqRes and save locally', async () => {
        mockedClient.get.mockResolvedValueOnce({
            data: { data: mockReqResUser },
        });
        mockedPrisma.user.upsert.mockResolvedValueOnce(mockLocalUser);

        const res = await request(app).post('/users/import/1');

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('email', 'george.bluth@reqres.in');
        expect(res.body).toHaveProperty('firstName', 'George');
    });

    it('should return 404 when user does not exist in ReqRes', async () => {
        mockedClient.get.mockRejectedValueOnce({
            response: { status: 404 },
        });

        const res = await request(app).post('/users/import/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found in ReqRes');
    });

    it('should return 400 when id is invalid', async () => {
        const res = await request(app).post('/users/import/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid user ID');
    });
});


describe('GET /users/saved', () => {
    it('should return all locally saved users', async () => {
        mockedPrisma.user.findMany.mockResolvedValueOnce([mockLocalUser]);

        const res = await request(app).get('/users/saved');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('id', 1);
    });

    it('should return empty array when no users saved', async () => {
        mockedPrisma.user.findMany.mockResolvedValueOnce([]);

        const res = await request(app).get('/users/saved');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });
});


describe('GET /users/saved/:id', () => {
    it('should return a locally saved user by id', async () => {
        mockedPrisma.user.findUnique.mockResolvedValueOnce(mockLocalUser);

        const res = await request(app).get('/users/saved/1');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('firstName', 'George');
    });

    it('should return 404 when user is not saved locally', async () => {
        mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

        const res = await request(app).get('/users/saved/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found locally');
    });

    it('should return 400 when id is invalid', async () => {
        const res = await request(app).get('/users/saved/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid user ID');
    });
});


describe('DELETE /users/saved/:id', () => {
    it('should delete a locally saved user', async () => {
        mockedPrisma.user.findUnique.mockResolvedValueOnce(mockLocalUser);
        mockedPrisma.user.delete.mockResolvedValueOnce(mockLocalUser);

        const res = await request(app).delete('/users/saved/1');

        expect(res.status).toBe(204);
    });

    it('should return 404 when user to delete does not exist locally', async () => {
        mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

        const res = await request(app).delete('/users/saved/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found locally');
    });
});