import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from '@/components/users/UserCard';
import { ReqResUser } from '@/types/user';

// Mock next/image since we don't have the Next.js server in tests
vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
    ),
}));

const mockUser: ReqResUser = {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
};

describe('UserCard', () => {
    it('renders user name and email', () => {
        render(
            <UserCard
                user={mockUser}
                isSaved={false}
                importing={false}
                onImport={vi.fn()}
                onClick={vi.fn()}
            />
        );

        expect(screen.getByText('George Bluth')).toBeInTheDocument();
        expect(screen.getByText('george.bluth@reqres.in')).toBeInTheDocument();
    });

    it('shows "Not saved" badge when user is not saved', () => {
        render(
            <UserCard
                user={mockUser}
                isSaved={false}
                importing={false}
                onImport={vi.fn()}
                onClick={vi.fn()}
            />
        );

        expect(screen.getByText('Not saved')).toBeInTheDocument();
        expect(screen.getByText('Import')).toBeInTheDocument();
    });

    it('shows "Saved" badge and disables import when user is saved', () => {
        render(
            <UserCard
                user={mockUser}
                isSaved={true}
                importing={false}
                onImport={vi.fn()}
                onClick={vi.fn()}
            />
        );

        expect(screen.getByText('Saved')).toBeInTheDocument();
        expect(screen.getByText('Imported')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /imported/i })).toBeDisabled();
    });

    it('calls onImport when Import button is clicked', async () => {
        const user = userEvent.setup();
        const handleImport = vi.fn();

        render(
            <UserCard
                user={mockUser}
                isSaved={false}
                importing={false}
                onImport={handleImport}
                onClick={vi.fn()}
            />
        );

        await user.click(screen.getByRole('button', { name: /import/i }));
        expect(handleImport).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when card info is clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(
            <UserCard
                user={mockUser}
                isSaved={false}
                importing={false}
                onImport={vi.fn()}
                onClick={handleClick}
            />
        );

        await user.click(screen.getByText('George Bluth'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});