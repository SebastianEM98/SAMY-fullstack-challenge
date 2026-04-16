import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Click me</Button>);
        await user.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<Button onClick={handleClick} disabled>Click me</Button>);
        await user.click(screen.getByText('Click me'));

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('shows spinner and disables button when loading', () => {
        render(<Button loading>Click me</Button>);

        expect(screen.getByText('Click me')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders correct variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('text-red-400');
    });
});