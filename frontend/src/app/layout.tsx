import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'User & Posts Management Portal | SAMY Challenge',
    description:
        'Fullstack application with authentication, user management, and posts CRUD built with Next.js, Express, PostgreSQL, and Prisma.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geist.className} bg-neutral-950 text-neutral-100 antialiased`}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#171717',
                            border: '1px solid #262626',
                            color: '#f5f5f5',
                        },
                    }}
                />
            </body>
        </html>
    );
}