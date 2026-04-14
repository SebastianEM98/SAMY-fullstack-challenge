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
};