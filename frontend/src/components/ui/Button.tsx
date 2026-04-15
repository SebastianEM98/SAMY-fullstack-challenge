import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
    primary: 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-semibold shadow-lg shadow-emerald-500/20',
    secondary: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700',
    ghost: 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
};

const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'cursor-pointer select-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={14} />
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}