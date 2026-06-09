import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { expect, test } from 'vitest';
import Header from './Header.svelte';

test('renders the primary nav items with their hrefs', async () => {
	await page.viewport(1280, 800);
	const screen = render(Header);

	await expect
		.element(screen.getByRole('link', { name: 'Features' }))
		.toHaveAttribute('href', '/#features');
	await expect.element(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
	await expect
		.element(screen.getByRole('link', { name: 'GitHub repository' }))
		.toHaveAttribute('href', 'https://github.com/equerry-dev/equerry');
	await expect
		.element(screen.getByRole('link', { name: 'Download' }))
		.toHaveAttribute('href', '/#download');
});

test('hamburger toggles aria-expanded and Escape restores focus to it', async () => {
	await page.viewport(390, 844);
	const screen = render(Header);
	const burger = screen.getByRole('button', { name: 'Open menu' });

	await expect.element(burger).toHaveAttribute('aria-expanded', 'false');

	await burger.click();
	await expect.element(burger).toHaveAttribute('aria-expanded', 'true');
	await expect.element(screen.getByRole('dialog')).toBeVisible();

	const panel = screen.getByRole('dialog').element();
	panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

	await expect.element(burger).toHaveAttribute('aria-expanded', 'false');
	expect(document.activeElement).toBe(burger.element());
});
