import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from '@/components/posts/PostForm';
import { LocalUser } from '@/types/user';
import { Post } from '@/types/post';

const mockAuthors: LocalUser[] = [
    {
        id: 1,
        email: 'george.bluth@reqres.in',
        firstName: 'George',
        lastName: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    },
];

const mockPost: Post = {
    id: 'cm9x4k2j10000356y1234abcd',
    title: 'Existing Post Title',
    content: 'This is the existing content of the post',
    authorUserId: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    author: mockAuthors[0],
};

describe('PostForm', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // VISIBILITY

    it('does not render when open is false', () => {
        render(
            <PostForm
                open={false}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        expect(screen.queryByText('New post')).not.toBeInTheDocument();
    });

    it('renders create mode when open and no initialData', () => {
        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        expect(screen.getByText('New post')).toBeInTheDocument();
        expect(screen.getByText('Create post')).toBeInTheDocument();
    });

    it('renders edit mode when initialData is provided', () => {
        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
                initialData={mockPost}
            />
        );

        expect(screen.getByText('Edit post')).toBeInTheDocument();
        expect(screen.getByText('Save changes')).toBeInTheDocument();
    });

    // INITIAL VALUES

    it('pre-fills fields when editing', () => {
        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
                initialData={mockPost}
            />
        );

        expect(screen.getByDisplayValue('Existing Post Title')).toBeInTheDocument();
        expect(
            screen.getByDisplayValue('This is the existing content of the post')
        ).toBeInTheDocument();
    });

    // VALIDATION

    it('shows validation errors when submitting empty form', async () => {
        const user = userEvent.setup();

        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        await user.click(screen.getByText('Create post'));

        await waitFor(() => {
            expect(
                screen.getByText('Title must be at least 3 characters')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Content must be at least 10 characters')
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when title is too short', async () => {
        const user = userEvent.setup();

        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        await user.type(screen.getByPlaceholderText('Post title...'), 'Hi');
        await user.click(screen.getByText('Create post'));

        await waitFor(() => {
            expect(
                screen.getByText('Title must be at least 3 characters')
            ).toBeInTheDocument();
        });
    });

    // SUBMISSION 

    it('calls onSubmit with correct data when form is valid', async () => {
        const user = userEvent.setup();

        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        await user.type(
            screen.getByPlaceholderText('Post title...'),
            'My New Post Title'
        );
        await user.type(
            screen.getByPlaceholderText('Write your post content...'),
            'This is the content of my new post'
        );
        await user.selectOptions(screen.getByRole('combobox'), '1');
        await user.click(screen.getByText('Create post'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledOnce();
            // Only verify the first argument (the data), ignore the event
            expect(onSubmit.mock.calls[0][0]).toEqual({
                title: 'My New Post Title',
                content: 'This is the content of my new post',
                authorUserId: 1,
            });
        });
    });

    // CLOSE

    it('calls onClose when cancel button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        await user.click(screen.getByText('Cancel'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
        const user = userEvent.setup();

        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={mockAuthors}
            />
        );

        // The backdrop is the div with bg-black/70
        const backdrop = document.querySelector('.backdrop-blur-sm') as HTMLElement;
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    // EMPTY AUTHORS

    it('shows warning when no authors are available', () => {
        render(
            <PostForm
                open={true}
                onClose={onClose}
                onSubmit={onSubmit}
                authors={[]}
            />
        );

        expect(
            screen.getByText(/No saved users. Import users first/i)
        ).toBeInTheDocument();
    });
});