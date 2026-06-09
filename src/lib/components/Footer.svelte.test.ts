import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import Footer from './Footer.svelte';

test('renders the footer links and copyright', async () => {
	const screen = render(Footer);

	await expect.element(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
	await expect
		.element(screen.getByRole('link', { name: 'GitHub' }))
		.toHaveAttribute('href', 'https://github.com/equerry-dev/equerry');
	await expect
		.element(screen.getByRole('link', { name: 'F-Droid' }))
		.toHaveAttribute('href', 'https://f-droid.org/packages/dev.equerry.app/');
	await expect
		.element(screen.getByRole('link', { name: 'License' }))
		.toHaveAttribute('href', 'https://github.com/equerry-dev/equerry/blob/main/LICENSE');
	await expect.element(screen.getByText(/GPL-3\.0/)).toBeVisible();
});
