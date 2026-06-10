import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';
import { GET } from './+server';
import { siteUrl } from '$lib/config/site';
import { flattenDocs } from '$lib/docs/nav';

test('sitemap lists every public route as an absolute URL', async () => {
	const body = await GET().text();
	const expected = ['/', '/docs', ...flattenDocs().map((page) => `/docs/${page.slug}`)];
	for (const path of expected) {
		expect(body).toContain(`<loc>${siteUrl}${path}</loc>`);
	}
});

test('robots.txt references the sitemap', () => {
	const robots = readFileSync(
		fileURLToPath(new URL('../../../static/robots.txt', import.meta.url)),
		'utf-8'
	);
	expect(robots).toMatch(/^Sitemap:\s*https:\/\/equerry\.dev\/sitemap\.xml$/m);
});
