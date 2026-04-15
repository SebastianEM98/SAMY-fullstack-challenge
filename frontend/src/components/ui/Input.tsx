import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-xs font-medium text-neutral-400 tracking-wide uppercase"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={clsx(
                            'w-full bg-neutral-900 border border-neutral-800 rounded-xl',
                            'text-sm text-neutral-100 placeholder:text-neutral-600',
                            'transition-all duration-200 outline-none',
                            'focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10',
                            'hover:border-neutral-700',
                            icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
                            error && 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';