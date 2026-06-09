import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import Hero from './Hero.svelte';

test('hero renders the download CTA via store badges', async () => {
	const screen = render(Hero);
	await expect.element(screen.getByRole('img', { name: /google play/i })).toBeVisible();
});

test('hero has a secondary link to the docs', async () => {
	const screen = render(Hero);
	await expect
		.element(screen.getByRole('link', { name: /docs/i }))
		.toHaveAttribute('href', '/docs');
});

test('hero reserves an app-screenshot placeholder', async () => {
	const screen = render(Hero);
	await expect.element(screen.getByRole('img', { name: /app preview/i })).toBeVisible();
});
