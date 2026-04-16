'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, FileText, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';

const navItems = [
    { href: '/users', label: 'Users', icon: Users },
    { href: '/posts', label: 'Posts', icon: FileText },
];

const SIDEBAR_WIDTH = 240;
const MOBILE_BREAKPOINT = 1100;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isCollapsed = collapsed && !isMobile;

    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (mobile) setCollapsed(true);
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Close the mobile sidebar when navigating
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch {
            toast.error('Failed to logout');
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">

            {/* Logo + toggle */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/60 shrink-0">
                <AnimatePresence mode="wait">
                    {!isCollapsed  && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                            </div>
                            <span className="text-sm font-semibold text-neutral-100 tracking-tight whitespace-nowrap">
                                Portal
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isMobile && (
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        className="ml-auto p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <Menu size={16} />
                    </button>
                )}

                {isMobile && (
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="ml-auto p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 flex flex-col gap-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                                isCollapsed ? 'justify-center' : '',
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/60'
                            )}
                            title={collapsed ? label : undefined}
                        >
                            <Icon size={16} className="shrink-0" />
                            <AnimatePresence mode="wait">
                                {!isCollapsed  && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="overflow-hidden whitespace-nowrap"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-neutral-800/60">
                <button
                    onClick={handleLogout}
                    className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer',
                        isCollapsed ? 'justify-center' : ''
                    )}
                    title={collapsed ? 'Sign out' : undefined}
                >
                    <LogOut size={16} className="shrink-0" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                Sign out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 flex">

            {/* Desktop sidebar */}
            {!isMobile && (
                <motion.aside
                    animate={{ width: collapsed ? 64 : SIDEBAR_WIDTH }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="shrink-0 border-r border-neutral-800/60 bg-neutral-950 overflow-hidden"
                >
                    <SidebarContent />
                </motion.aside>
            )}

            {/* Mobile overlay */}
            <AnimatePresence>
                {isMobile && mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -SIDEBAR_WIDTH }}
                            animate={{ x: 0 }}
                            exit={{ x: -SIDEBAR_WIDTH }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            style={{ width: SIDEBAR_WIDTH }}
                            className="fixed left-0 top-0 bottom-0 z-50 border-r border-neutral-800/60 bg-neutral-950"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <header className="h-16 border-b border-neutral-800/60 flex items-center px-6 shrink-0 gap-4">
                    {isMobile && (
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all cursor-pointer"
                        >
                            <Menu size={18} />
                        </button>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-600">Portal</span>
                        <span className="text-neutral-700">/</span>
                        <span className="text-neutral-300 capitalize">
                            {pathname.split('/')[1]}
                        </span>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}