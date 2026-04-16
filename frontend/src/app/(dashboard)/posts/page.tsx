'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Spinner, EmptyState } from '@/components/ui';
import { PostCard } from '@/components/posts/PostCard';
import { PostForm } from '@/components/posts/PostForm';
import { postsApi } from '@/lib/api/posts';
import { usersApi } from '@/lib/api/users';
import { Post, CreatePostDto, UpdatePostDto } from '@/types/post';
import { LocalUser } from '@/types/user';

export default function PostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [authors, setAuthors] = useState<LocalUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | undefined>();

    useEffect(() => {
        fetchPosts();
    }, [page]);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await postsApi.getPosts(page);
            setPosts(res.data);
            setTotalPages(res.meta.totalPages);
            setTotal(res.meta.total);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch posts');
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

    const handleCreate = async (data: CreatePostDto) => {
        setSubmitting(true);
        try {
            const post = await postsApi.createPost(data);
            setPosts((prev) => [post, ...prev]);
            setTotal((t) => t + 1);
            setFormOpen(false);
            toast.success('Post created');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (data: UpdatePostDto) => {
        if (!editingPost) return;
        setSubmitting(true);
        try {
            const updated = await postsApi.updatePost(editingPost.id, data);
            setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingPost(undefined);
            setFormOpen(false);
            toast.success('Post updated');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (post: Post) => {
        try {
            await postsApi.deletePost(post.id);
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
            setTotal((t) => t - 1);
            toast.success('Post deleted');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete post');
        }
    };

    const openCreate = () => {
        setEditingPost(undefined);
        setFormOpen(true);
    };

    const openEdit = (post: Post) => {
        setEditingPost(post);
        setFormOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-neutral-100">Posts</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        {total > 0 ? `${total} post${total === 1 ? '' : 's'}` : 'No posts yet'}
                    </p>
                </div>
                <Button
                    icon={<Plus size={14} />}
                    onClick={openCreate}
                >
                    New post
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <Spinner label="Loading posts..." />
            ) : posts.length === 0 ? (
                <EmptyState
                    icon={<FileText size={20} />}
                    title="No posts yet"
                    description="Create your first post to get started"
                    action={
                        <Button icon={<Plus size={14} />} onClick={openCreate}>
                            New post
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onClick={(p) => router.push(`/posts/${p.id}`)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-neutral-600">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<ChevronLeft size={14} />}
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Prev
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<ChevronRight size={14} />}
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Form modal */}
            <PostForm
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingPost(undefined); }}
                onSubmit={editingPost ? handleUpdate : handleCreate}
                authors={authors}
                initialData={editingPost}
                loading={submitting}
            />
        </div>
    );
}