import { apiClient } from '../apiClient';
import { LocalUser, ReqResUser, ReqResUsersResponse } from '@/types/user';

export const usersApi = {
    getReqResUsers: (page: number = 1) =>
        apiClient<ReqResUsersResponse>(`/users/reqres?page=${page}`),

    getReqResUserById: (id: number) =>
        apiClient<ReqResUser>(`/users/reqres/${id}`),

    importUser: (id: number) =>
        apiClient<LocalUser>(`/users/import/${id}`, { method: 'POST' }),

    getSavedUsers: () =>
        apiClient<LocalUser[]>('/users/saved'),

    getSavedUserById: (id: number) =>
        apiClient<LocalUser>(`/users/saved/${id}`),

    deleteSavedUser: (id: number) =>
        apiClient(`/users/saved/${id}`, { method: 'DELETE' }),
};