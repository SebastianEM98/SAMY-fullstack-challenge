import { clsx } from 'clsx';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={clsx('flex flex-col items-center justify-center py-16 gap-4 text-center', className)}>
            {icon && (
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                    {icon}
                </div>
            )}
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-neutral-300">{title}</p>
                {description && (
                    <p className="text-xs text-neutral-600 max-w-xs">{description}</p>
                )}
            </div>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}