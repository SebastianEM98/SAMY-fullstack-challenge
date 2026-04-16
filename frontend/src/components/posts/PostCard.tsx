import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, User } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { Post } from '@/types/post';

interface PostCardProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (post: Post) => void;
    onClick: (post: Post) => void;
}

export function PostCard({ post, onEdit, onDelete, onClick }: PostCardProps) {
    return (
        <Card hover className="flex flex-col gap-4">

            {/* Title + body */}
            <div className="flex flex-col gap-2 cursor-pointer" onClick={() => onClick(post)}>
                <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2 leading-snug">
                    {post.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-neutral-800" />

            {/* Footer */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                        <User size={11} className="text-neutral-500" />
                    </div>
                    <p className="text-xs text-neutral-500 truncate">
                        {post.author.firstName} {post.author.lastName}
                    </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="default">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={12} />}
                        onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                    />
                    <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={12} />}
                        onClick={(e) => { e.stopPropagation(); onDelete(post); }}
                    />
                </div>
            </div>
        </Card>
    );
}