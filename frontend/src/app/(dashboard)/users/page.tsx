'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button, Input, Spinner, EmptyState } from '@/components/ui';
import { UserCard } from '@/components/users/UserCard';
import { usersApi } from '@/lib/api/users';
import { ReqResUser } from '@/types/user';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<ReqResUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [importingId, setImportingId] = useState<number | null>(null);
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchUsers();
    }, [page]);

    useEffect(() => {
        fetchSavedIds();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await usersApi.getReqResUsers(page);
            setUsers(res.data);
            setTotalPages(res.total_pages);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedIds = async () => {
        try {
            const saved = await usersApi.getSavedUsers();
            setSavedIds(new Set(saved.map((u) => u.id)));
        } catch {
            // silently fail
        }
    };

    const handleImport = async (user: ReqResUser) => {
        setImportingId(user.id);
        try {
            await usersApi.importUser(user.id);
            setSavedIds((prev) => new Set([...prev, user.id]));
            toast.success(`${user.first_name} saved locally`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to import user');
        } finally {
            setImportingId(null);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                u.first_name.toLowerCase().includes(q) ||
                u.last_name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
        );
    }, [users, search]);

    return (
        <div className="flex flex-col gap-6 max-w-5xl">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-neutral-100">Users</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Browse and import users from ReqRes
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={<Users size={14} />}
                    onClick={() => router.push('/users/saved')}
                >
                    Saved users
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Search by name or email..."
                icon={<Search size={15} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Content */}
            {loading ? (
                <Spinner label="Fetching users..." />
            ) : filteredUsers.length === 0 ? (
                <EmptyState
                    icon={<Users size={20} />}
                    title="No users found"
                    description={search ? 'Try a different search term' : 'No users available'}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            isSaved={savedIds.has(user.id)}
                            importing={importingId === user.id}
                            onImport={() => handleImport(user)}
                            onClick={() => router.push(`/users/${user.id}`)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!search && (
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
        </div>
    );
}