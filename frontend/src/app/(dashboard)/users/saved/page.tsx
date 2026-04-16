'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Users, Trash2 } from 'lucide-react';
import { Button, Card, Spinner, EmptyState, Badge } from '@/components/ui';
import { usersApi } from '@/lib/api/users';
import { LocalUser } from '@/types/user';
import Image from 'next/image';

export default function SavedUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<LocalUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchSavedUsers();
    }, []);

    const fetchSavedUsers = async () => {
        setLoading(true);
        try {
            const data = await usersApi.getSavedUsers();
            setUsers(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch saved users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user: LocalUser) => {
        setDeletingId(user.id);
        try {
            await usersApi.deleteSavedUser(user.id);
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            toast.success(`${user.firstName} removed locally`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowLeft size={14} />}
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-neutral-100">Saved Users</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Users imported from ReqRes to your local database
                    </p>
                </div>
            </div>

            {/* Count badge */}
            {!loading && (
                <div className="flex items-center gap-2">
                    <Badge variant={users.length > 0 ? 'success' : 'default'}>
                        {users.length} {users.length === 1 ? 'user' : 'users'} saved
                    </Badge>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <Spinner label="Loading saved users..." />
            ) : users.length === 0 ? (
                <EmptyState
                    icon={<Users size={20} />}
                    title="No saved users"
                    description="Import users from the Users page to see them here"
                    action={
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push('/users')}
                        >
                            Browse users
                        </Button>
                    }
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {users.map((user) => (
                        <Card
                            key={user.id}
                            hover
                            className="flex items-center gap-4"
                        >
                            {/* Avatar */}
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    width={44}
                                    height={44}
                                    className="rounded-xl object-cover w-11 h-11 shrink-0"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                                    <Users size={18} className="text-neutral-600" />
                                </div>
                            )}

                            {/* Info */}
                            <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => router.push(`/users/${user.id}`)}
                            >
                                <p className="text-sm font-medium text-neutral-100 truncate">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                            </div>

                            {/* Meta */}
                            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                                <p className="text-xs text-neutral-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                                <Badge variant="success" className="text-xs">Saved</Badge>
                            </div>

                            {/* Delete */}
                            <Button
                                variant="danger"
                                size="sm"
                                icon={<Trash2 size={13} />}
                                loading={deletingId === user.id}
                                onClick={() => handleDelete(user)}
                            >
                                <span className="hidden sm:inline">Remove</span>
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}