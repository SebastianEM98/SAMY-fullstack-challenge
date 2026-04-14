import { Post } from '@prisma/client';

export interface CreatePostDto {
    title: string;
    content: string;
    authorUserId: AuthorUserId;
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
}

export type PostId = Post['id'];
export type AuthorUserId = Post['authorUserId'];