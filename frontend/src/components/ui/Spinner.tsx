import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: number;
    className?: string;
    label?: string;
}

export function Spinner({ size = 20, className, label = 'Loading...' }: SpinnerProps) {
    return (
        <div className={clsx('flex flex-col items-center justify-center gap-3 py-12', className)}>
            <Loader2 size={size} className="animate-spin text-emerald-500" />
            {label && <p className="text-sm text-neutral-500">{label}</p>}
        </div>
    );
}