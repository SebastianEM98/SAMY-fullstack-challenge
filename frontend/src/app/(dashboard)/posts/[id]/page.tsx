'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2, User, Calendar } from 'lucide-react';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import { PostForm } from '@/components/posts/PostForm';
import { postsApi } from '@/lib/api/posts';
import { usersApi } from '@/lib/api/users';
import { Post, UpdatePostDto } from '@/types/post';
import { LocalUser } from '@/types/user';
import { format } from 'date-fns';

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);
    const [authors, setAuthors] = useState<LocalUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchAuthors();
    }, [id]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const data = await postsApi.getPostById(id);
            setPost(data);
        } catch (error: any) {
            toast.error(error.message || 'Post not found');
            router.push('/posts');
        } finally {
            setLoading(false);
        }
    };

    const fetchAuthors = async () => {
        try {
            const data = await usersApi.getSavedUsers();
            setAuthors(data);
        } catch {
            // silently fail
        }
    };

    const handleUpdate = async (data: UpdatePostDto) => {
        if (!post) return;
        setSubmitting(true);
        try {
            const updated = await postsApi.updatePost(post.id, data);
            setPost(updated);
            setEditOpen(false);
            toast.success('Post updated');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;
        try {
            await postsApi.deletePost(post.id);
            toast.success('Post deleted');
            router.push('/posts');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete post');
        }
    };

    if (loading) return <Spinner label="Loading post..." />;
    if (!post) return null;

    return (
        <div className="flex flex-col gap-6 max-w-2xl">

            {/* Back */}
            <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.back()}
                className="self-start"
            >
                Back
            </Button>

            {/* Post card */}
            <Card className="flex flex-col gap-6">

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold text-neutral-100 leading-snug">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default">
                            <User size={10} className="mr-1" />
                            {post.author.firstName} {post.author.lastName}
                        </Badge>
                        <Badge variant="default">
                            <Calendar size={10} className="mr-1" />
                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </Badge>
                        {post.updatedAt !== post.createdAt && (
                            <Badge variant="info">
                                Edited {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-800" />

                {/* Content */}
                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>

                {/* Divider */}
                <div className="h-px bg-neutral-800" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={<Pencil size={13} />}
                        onClick={() => setEditOpen(true)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={13} />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Card>

            {/* Edit modal */}
            <PostForm
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSubmit={handleUpdate}
                authors={authors}
                initialData={post}
                loading={submitting}
            />
        </div>
    );
}