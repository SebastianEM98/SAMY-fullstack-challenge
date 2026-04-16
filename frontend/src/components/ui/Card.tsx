import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-neutral-900 border border-neutral-800 rounded-2xl p-5',
                hover && 'hover:border-neutral-700 hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h3 className={clsx('text-sm font-semibold text-neutral-100', className)}>
            {children}
        </h3>
    );
}