import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';


// Mock the prisma config module
jest.mock('../config/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
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
    },
}));

// Mock the auth middleware so these tests don't depend on the token
jest.mock('../middleware/authenticate', () => ({
    authenticate: (_req: any, _res: any, next: any) => next(),
}));


const mockedPrisma = prisma as any;

const app = createApp();

const mockUser = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockPost = {
    id: 'cm9x4k2j10000356y1234abcd',
    title: 'Test Post',
    content: 'This is test content for the post',
    authorUserId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockUser,
};


// Helper to reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
});


describe('POST /posts', () => {
    it('should create a post successfully', async () => {
        mockedPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
        mockedPrisma.post.create.mockResolvedValueOnce(mockPost);

        const res = await request(app)
            .post('/posts')
            .send({
                title: 'Test Post',
                content: 'This is test content for the post',
                authorUserId: 1,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('title', 'Test Post');
        expect(res.body).toHaveProperty('authorUserId', 1);
    });

    it('should return 400 when title is too short', async () => {
        const res = await request(app)
            .post('/posts')
            .send({
                title: 'Hi',
                content: 'This is test content for the post',
                authorUserId: 1,
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 404 when author does not exist locally', async () => {
        mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/posts')
            .send({
                title: 'Test Post',
                content: 'This is test content for the post',
                authorUserId: 999,
            });

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/Author not found/);
    });
});


describe('GET /posts', () => {
    it('should return paginated posts', async () => {
        mockedPrisma.$transaction.mockResolvedValueOnce([[mockPost], 1,]);

        const res = await request(app).get('/posts?page=1&limit=10');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
        expect(res.body.meta).toHaveProperty('total', 1);
    });

    it('should return empty data when no posts exist', async () => {
        mockedPrisma.$transaction.mockResolvedValueOnce([[], 0]);

        const res = await request(app).get('/posts');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(0);
        expect(res.body.meta.total).toBe(0);
    });
});


describe('GET /posts/:id', () => {
    it('should return a post by id', async () => {
        mockedPrisma.post.findUnique.mockResolvedValueOnce(mockPost);

        const res = await request(app).get(`/posts/${mockPost.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', mockPost.id);
        expect(res.body).toHaveProperty('title', mockPost.title);
    });

    it('should return 404 when post does not exist', async () => {
        mockedPrisma.post.findUnique.mockResolvedValueOnce(null);

        const res = await request(app).get(`/posts/${mockPost.id}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Post not found');
    });

    it('should return 400 when id is not a valid cuid', async () => {
        const res = await request(app).get('/posts/invalid-id');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid post ID');
    });
});


describe('PUT /posts/:id', () => {
    it('should update a post successfully', async () => {
        const updatedPost = { ...mockPost, title: 'Updated Title' };

        mockedPrisma.post.findUnique.mockResolvedValueOnce(mockPost);
        mockedPrisma.post.update.mockResolvedValueOnce(updatedPost);

        const res = await request(app)
            .put(`/posts/${mockPost.id}`)
            .send({ title: 'Updated Title' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', 'Updated Title');
    });

    it('should return 404 when post to update does not exist', async () => {
        mockedPrisma.post.findUnique.mockResolvedValueOnce(null);

        const res = await request(app)
            .put(`/posts/${mockPost.id}`)
            .send({ title: 'Updated Title' });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Post not found');
    });

    it('should return 400 when body is empty', async () => {
        const res = await request(app).put(`/posts/${mockPost.id}`).send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Validation failed');
    });
});


describe('DELETE /posts/:id', () => {
    it('should delete a post successfully', async () => {
        mockedPrisma.post.findUnique.mockResolvedValueOnce(mockPost);
        mockedPrisma.post.delete.mockResolvedValueOnce(mockPost);

        const res = await request(app).delete(`/posts/${mockPost.id}`);

        expect(res.status).toBe(204);
    });

    it('should return 404 when post to delete does not exist', async () => {
        mockedPrisma.post.findUnique.mockResolvedValueOnce(null);

        const res = await request(app).delete(`/posts/${mockPost.id}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Post not found');
    });
});