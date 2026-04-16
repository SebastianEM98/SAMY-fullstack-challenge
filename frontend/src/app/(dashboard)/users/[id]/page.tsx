'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Download, Check, Mail, Hash } from 'lucide-react';
import { Button, Badge, Card, Spinner } from '@/components/ui';
import { usersApi } from '@/lib/api/users';
import { ReqResUser, LocalUser } from '@/types/user';
import Image from 'next/image';

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [user, setUser] = useState<ReqResUser | null>(null);
    const [savedUser, setSavedUser] = useState<LocalUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const [reqresUser, localUser] = await Promise.allSettled([
                usersApi.getReqResUserById(Number(id)),
                usersApi.getSavedUserById(Number(id)),
            ]);

            if (reqresUser.status === 'fulfilled') {
                setUser(reqresUser.value);
            } else {
                toast.error('User not found');
                router.push('/users');
                return;
            }

            if (localUser.status === 'fulfilled') {
                setSavedUser(localUser.value);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!user) return;
        setImporting(true);
        try {
            const saved = await usersApi.importUser(user.id);
            setSavedUser(saved);
            toast.success(`${user.first_name} saved locally`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to import user');
        } finally {
            setImporting(false);
        }
    };

    if (loading) return <Spinner label="Loading user..." />;
    if (!user) return null;

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

            {/* Profile card */}
            <Card className="flex flex-col gap-6">

                {/* Avatar + name */}
                <div className="flex items-center gap-5">
                    <Image
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        width={80}
                        height={80}
                        loading="eager"
                        className="rounded-2xl object-cover w-20 h-20 ring-2 ring-neutral-800"
                    />
                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-xl font-bold text-neutral-100">
                            {user.first_name} {user.last_name}
                        </h1>
                        {savedUser ? (
                            <Badge variant="success">
                                <Check size={10} className="mr-1" />
                                Saved locally
                            </Badge>
                        ) : (
                            <Badge variant="default">Not saved locally</Badge>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-800" />

                {/* Info */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                            <Hash size={14} className="text-neutral-500" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-600 mb-0.5">ReqRes ID</p>
                            <p className="text-neutral-300">{user.id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                            <Mail size={14} className="text-neutral-500" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-600 mb-0.5">Email</p>
                            <p className="text-neutral-300">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-800" />

                {/* Local data */}
                {savedUser && (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                            Local record
                        </p>
                        <div className="bg-neutral-800/50 rounded-xl p-4 flex flex-col gap-2 text-xs text-neutral-400">
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Saved at</span>
                                <span>{new Date(savedUser.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Last updated</span>
                                <span>{new Date(savedUser.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action */}
                <Button
                    variant={savedUser ? 'secondary' : 'primary'}
                    icon={savedUser ? <Check size={14} /> : <Download size={14} />}
                    loading={importing}
                    disabled={!!savedUser}
                    onClick={handleImport}
                    className="self-start"
                >
                    {savedUser ? 'Already saved' : 'Save locally'}
                </Button>
            </Card>
        </div>
    );
}