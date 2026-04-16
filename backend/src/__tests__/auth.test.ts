import request from 'supertest';
import { createApp } from '../app';
import { reqresClient } from '../config/reqresClient';


jest.mock('../config/reqresClient', () => ({
    reqresClient: {
        post: jest.fn(),
        get: jest.fn(),
    },
}));

const mockedClient = reqresClient as jest.Mocked<typeof reqresClient>;

const app = createApp();

describe('POST /auth/login', () => {

    it('should login successfully and return a token + cookie', async () => {
        // Simulate successful ReqRes response
        mockedClient.post.mockResolvedValueOnce({
            data: { token: 'fake-token-123' },
        });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'eve.holt@reqres.in', password: '1234' });


        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toBe('fake-token-123');

        // validate cookie
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 when email is invalid', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'not-an-email', password: '1234' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 401 when credentials are wrong', async () => {

        mockedClient.post.mockRejectedValueOnce({
            response: {
                status: 401,
                data: { error: 'user not found' },
            },
        });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@email.com', password: '1234' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'user not found');
    });
});


describe('POST /auth/logout', () => {

    it('should clear cookie and logout', async () => {
        const res = await request(app)
            .post('/auth/logout');
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Logged out successfully');
    
        // validate that the cookie was cleared
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toContain('token=;');
    });
});