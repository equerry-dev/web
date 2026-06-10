import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import Seo from './Seo.svelte';

const PROPS = {
	title: 'Test Page — Equerry',
	description: 'A unique description for the test page.',
	path: '/docs/install'
};

test('renders the page title and meta description', async () => {
	render(Seo, PROPS);
	expect(document.title).toBe(PROPS.title);
	const desc = document.head.querySelector('meta[name="description"]');
	expect(desc?.getAttribute('content')).toBe(PROPS.description);
});

test('emits an absolute canonical link built from siteUrl + path', async () => {
	render(Seo, PROPS);
	const canonical = document.head.querySelector('link[rel="canonical"]');
	expect(canonical?.getAttribute('href')).toBe('https://equerry.dev/docs/install');
});

test('emits Open Graph and Twitter card tags with the image', async () => {
	render(Seo, PROPS);
	expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
		PROPS.title
	);
	expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
		'https://equerry.dev/docs/install'
	);
	expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
		'https://equerry.dev/og-default.png'
	);
	expect(document.head.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
		'summary_large_image'
	);
	expect(document.head.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
		'https://equerry.dev/og-default.png'
	);
});
