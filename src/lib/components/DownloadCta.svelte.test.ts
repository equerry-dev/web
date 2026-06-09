import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import DownloadCta from './DownloadCta.svelte';

test('repeats both store badges via StoreBadges', async () => {
	const screen = render(DownloadCta);
	await expect.element(screen.getByRole('img', { name: /google play/i })).toBeVisible();
	await expect.element(screen.getByRole('img', { name: /f-droid/i })).toBeVisible();
});

test('exposes the #download anchor target the header CTA points at', async () => {
	const screen = render(DownloadCta);
	const heading = screen.getByRole('heading', { name: /get equerry/i }).element();
	expect(heading.closest('#download')).not.toBeNull();
});
