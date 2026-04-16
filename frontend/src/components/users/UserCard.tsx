import { Download, Check, ExternalLink } from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { ReqResUser } from '@/types/user';
import Image from 'next/image';

interface UserCardProps {
    user: ReqResUser;
    isSaved: boolean;
    importing: boolean;
    onImport: () => void;
    onClick: () => void;
}

export function UserCard({ user, isSaved, importing, onImport, onClick }: UserCardProps) {
    return (
        <Card hover className="flex flex-col gap-4">
            {/* Avatar + info */}
            <div className="flex items-center gap-3" onClick={onClick}>
                <div className="relative shrink-0">
                    <Image
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        width={44}
                        height={44}
                        className="rounded-xl object-cover w-11 h-11"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-100 truncate">
                        {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                </div>
                <ExternalLink size={13} className="text-neutral-700 shrink-0" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                {isSaved ? (
                    <Badge variant="success">
                        <Check size={10} className="mr-1" />
                        Saved
                    </Badge>
                ) : (
                    <Badge variant="default">Not saved</Badge>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    icon={<Download size={13} />}
                    loading={importing}
                    disabled={isSaved}
                    onClick={(e) => {
                        e.stopPropagation();
                        onImport();
                    }}
                >
                    {isSaved ? 'Imported' : 'Import'}
                </Button>
            </div>
        </Card>
    );
}