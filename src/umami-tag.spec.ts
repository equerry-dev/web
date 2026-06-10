import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

const appHtml = readFileSync(fileURLToPath(new URL('./app.html', import.meta.url)), 'utf-8');

test('loads the Umami tracker from the same origin (/umami.js)', () => {
	expect(appHtml).toMatch(/<script\b[^>]*\bsrc="\/umami\.js"/);
	// The tracker must not be loaded from a cross-origin URL.
	expect(appHtml).not.toMatch(/src="https?:\/\/[^"]*umami[^"]*\.js"/);
});

test('wires the configured website id and beacon host-url', () => {
	expect(appHtml).toContain('data-website-id="1bfaf8df-b439-4711-ad6e-c49f00565980"');
	expect(appHtml).toContain('data-host-url="https://umami.rivil.co.uk"');
});
