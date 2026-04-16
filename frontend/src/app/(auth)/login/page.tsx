'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { authApi } from '@/lib/api/auth';

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'eve.holt@reqres.in',
            password: '1234456',
        },
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            await authApi.login(data);  // the backend sets the cookies
            toast.success('Welcome back!');
            router.push('/users');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-8">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[64px_64px]" />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 max-w-full bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full sm:max-w-sm max-w-full flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                        <LogIn size={18} className="text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
                        Sign in
                    </h1>
                    <p className="text-sm text-neutral-500">
                        User & Posts Management Portal
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail size={15} />}
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={15} />}
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full mt-2"
                        size="lg"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                {/* Hint */}
                <p className="text-center text-sm text-neutral-600">
                    Demo credentials are pre-filled
                </p>
            </div>
        </main>
    );
}