import { apiClient } from '../apiClient';
import { Post, PostsResponse, CreatePostDto, UpdatePostDto } from '@/types/post';

export const postsApi = {
    getPosts: (page: number = 1, limit: number = 10) =>
        apiClient<PostsResponse>(`/posts?page=${page}&limit=${limit}`),

    getPostById: (id: string) =>
        apiClient<Post>(`/posts/${id}`),

    createPost: (dto: CreatePostDto) =>
        apiClient<Post>('/posts', { method: 'POST', body: dto }),

    updatePost: (id: string, dto: UpdatePostDto) =>
        apiClient<Post>(`/posts/${id}`, { method: 'PUT', body: dto }),

    deletePost: (id: string) =>
        apiClient(`/posts/${id}`, { method: 'DELETE' }),
};