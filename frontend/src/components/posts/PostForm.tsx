import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Post } from '@/types/post';
import { LocalUser } from '@/types/user';
import { clsx } from 'clsx';

const postSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    authorUserId: z.coerce
        .number({ error: 'Select an author' })
        .int()
        .positive('Select an author'),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PostFormData) => Promise<void>;
    authors: LocalUser[];
    initialData?: Post;
    loading?: boolean;
}

export function PostForm({ open, onClose, onSubmit, authors, initialData, loading }: PostFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PostFormData, any, PostFormData>({
        resolver: zodResolver(postSchema) as any,
        defaultValues: initialData
            ? {
                title: initialData.title,
                content: initialData.content,
                authorUserId: initialData.authorUserId,
            }
            : undefined,
    });

    useEffect(() => {
        if (open && initialData) {
            reset({
                title: initialData.title,
                content: initialData.content,
                authorUserId: initialData.authorUserId,
            });
        }
        if (!open) reset({ title: '', content: '', authorUserId: undefined });
    }, [open, initialData]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col gap-5 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-neutral-100">
                        {initialData ? 'Edit post' : 'New post'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        label="Title"
                        placeholder="Post title..."
                        error={errors.title?.message}
                        {...register('title')}
                    />

                    {/* Content textarea */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
                            Content
                        </label>
                        <textarea
                            rows={5}
                            placeholder="Write your post content..."
                            className={clsx(
                                'w-full bg-neutral-900 border border-neutral-800 rounded-xl',
                                'text-sm text-neutral-100 placeholder:text-neutral-600',
                                'px-4 py-2.5 resize-none transition-all duration-200 outline-none',
                                'focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10',
                                'hover:border-neutral-700',
                                errors.content && 'border-red-500/50'
                            )}
                            {...register('content')}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-400">{errors.content.message}</p>
                        )}
                    </div>

                    {/* Author select */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
                            Author
                        </label>
                        <select
                            className={clsx(
                                'w-full bg-neutral-900 border border-neutral-800 rounded-xl',
                                'text-sm text-neutral-100 px-4 py-2.5 outline-none',
                                'focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10',
                                'hover:border-neutral-700 transition-all duration-200',
                                errors.authorUserId && 'border-red-500/50'
                            )}
                            {...register('authorUserId')}
                        >
                            <option value="">Select an author...</option>
                            {authors.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.authorUserId && (
                            <p className="text-xs text-red-400">{errors.authorUserId.message}</p>
                        )}
                        {authors.length === 0 && (
                            <p className="text-xs text-amber-400">
                                No saved users. Import users first to create posts.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button variant="secondary" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            {initialData ? 'Save changes' : 'Create post'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}