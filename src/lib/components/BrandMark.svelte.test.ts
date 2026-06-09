import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import BrandMark from './BrandMark.svelte';

test('renders the Equerry wordmark', async () => {
	const screen = render(BrandMark);
	await expect.element(screen.getByText('Equerry')).toBeVisible();
});

test('links home by default with an accessible label', async () => {
	const screen = render(BrandMark);
	await expect.element(screen.getByRole('link', { name: /equerry/i })).toHaveAttribute('href', '/');
});
