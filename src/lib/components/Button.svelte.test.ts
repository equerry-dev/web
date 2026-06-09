import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import Button from './Button.svelte';

test('primary variant uses the primary fill, not the ghost border', async () => {
	const screen = render(Button, { variant: 'primary' });
	const cls = screen.getByRole('button').element().className;
	expect(cls).toContain('bg-primary');
	expect(cls).not.toContain('border-border');
});

test('ghost variant uses the border, not the primary fill', async () => {
	const screen = render(Button, { variant: 'ghost' });
	const cls = screen.getByRole('button').element().className;
	expect(cls).toContain('border-border');
	expect(cls).not.toContain('bg-primary');
});

test('renders an anchor when href is provided', async () => {
	const screen = render(Button, { variant: 'primary', href: '/download' });
	await expect.element(screen.getByRole('link')).toHaveAttribute('href', '/download');
});
