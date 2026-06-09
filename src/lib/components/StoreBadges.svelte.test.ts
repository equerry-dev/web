import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import StoreBadges from './StoreBadges.svelte';

const PLAY_URL = 'https://play.google.com/store/apps/details?id=co.equerry';

test('renders a link whose href is exactly the configured store URL', async () => {
	const screen = render(StoreBadges, { playStore: PLAY_URL, fdroid: null });
	const link = screen.getByRole('link', { name: /google play/i });
	await expect.element(link).toHaveAttribute('href', PLAY_URL);
});

test('an unset store URL renders a coming-soon badge with no link', async () => {
	const screen = render(StoreBadges, { playStore: null, fdroid: null });
	const badge = screen.getByRole('img', { name: /google play/i }).element();
	// The badge must not be wrapped in an anchor when the URL is unset.
	expect(badge.closest('a')).toBeNull();
	await expect.element(screen.getByText(/coming soon/i).first()).toBeVisible();
});

test('badge image src is a self-hosted /badges path, never an external origin', async () => {
	const screen = render(StoreBadges, { playStore: PLAY_URL, fdroid: PLAY_URL });
	const src = screen
		.getByRole('img', { name: /google play/i })
		.element()
		.getAttribute('src');
	expect(src).toMatch(/^\/badges\//);
	expect(src).not.toMatch(/^https?:/);
});
