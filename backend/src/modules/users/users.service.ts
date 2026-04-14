import { reqresClient } from '../../config/reqresClient';
import { usersRepository } from './users.repository';
import { ReqResListResponse, ReqResPage, ReqResUser, ReqResUserId } from './users.types';

export const usersService = {

    // Fetches paginated list from ReqRes
    async getReqResUsers(page: ReqResPage = 1): Promise<ReqResListResponse> {
        try {
            const { data } = await reqresClient.get<ReqResListResponse>('/users', {
                params: { page },
            });

            return data;

        } catch (error: any) {
            const err = new Error('Failed to fetch users from ReqRes') as any;
            err.statusCode = 502;
            throw err;
        }
    },

    // Reusable function that fetches a user from ReqRes
    async fetchUserFromReqRes(id: ReqResUserId): Promise<ReqResUser> {
        try {
            const { data } = await reqresClient.get<{ data: ReqResUser }>(`/users/${id}`);

            if (!data.data) {
                const err = new Error('User not found in ReqRes') as any;
                err.statusCode = 404;
                throw err;
            }

            return data.data;
        } catch (error: any) {
            if (error.statusCode) throw error;

            if (error.response?.status === 404) {
                const err = new Error('User not found in ReqRes') as any;
                err.statusCode = 404;
                throw err;
            }

            const err = new Error('Failed to fetch user from ReqRes') as any;
            err.statusCode = 502;
            throw err;
        }
    },

    // Fetches a user from ReqRes by ID
    async getReqResUserById(id: ReqResUserId) {
        return this.fetchUserFromReqRes(id);
    },

    // Fetches a user from ReqRes and saves them to the DB
    async importUser(id: ReqResUserId) {
        const user = await this.fetchUserFromReqRes(id);
        return usersRepository.save(user);
    },

    // Fetches all local users
    async getSavedUsers() {
        return usersRepository.findAll();
    },
};