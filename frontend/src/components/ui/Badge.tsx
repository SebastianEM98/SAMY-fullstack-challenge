import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variants: Record<BadgeVariant, string> = {
    default: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}