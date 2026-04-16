import { LocalUser } from "./user";

export interface Post {
    id: string;
    title: string;
    content: string;
    authorUserId: number;
    createdAt: string;
    updatedAt: string;
    author: LocalUser;
}

export interface PostsResponse {
    data: Post[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreatePostDto {
    title: string;
    content: string;
    authorUserId: number;
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
}