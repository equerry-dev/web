import { expect, test } from '@playwright/test';

// Every public route, plus an unknown path that renders the branded 404.
const ROUTES = [
	'/',
	'/docs',
	'/docs/install',
	'/docs/default-assistant',
	'/docs/add-a-provider',
	'/docs/capability-slots',
	'/this-route-does-not-exist'
];

test.describe('privacy network guard', () => {
	for (const path of ROUTES) {
		test(`${path} — no off-origin requests beyond Umami, and sets no cookies`, async ({
			page,
			baseURL
		}) => {
			const host = new URL(baseURL ?? 'http://localhost:4173').host;
			// The site itself plus the one sanctioned exception (self-hosted,
			// cookieless Umami page-view beacon) — nothing else may leave the origin.
			const allowed = new Set([host, 'umami.rivil.co.uk']);
			const offOrigin: string[] = [];
			page.on('request', (req) => {
				const url = new URL(req.url());
				if (url.protocol === 'data:' || url.protocol === 'blob:') return;
				if (!allowed.has(url.host)) offOrigin.push(req.url());
			});

			await page.goto(path);
			// Let the deferred Umami beacon (and anything else) fire before asserting.
			await page.waitForLoadState('networkidle');

			expect(offOrigin, `${path} off-origin requests`).toEqual([]);

			// The static site sets no cookies (theme state lives in localStorage).
			const cookies = await page.evaluate(() => document.cookie);
			expect(cookies, `${path} document.cookie`).toBe('');
		});
	}

	test('records a page view: the Umami beacon fires on load', async ({ page }) => {
		// Resolves when the page-view POST is initiated; times out (fails) if the
		// self-hosted Umami tracker never sends a beacon.
		const beacon = page.waitForRequest(
			(req) => req.url().startsWith('https://umami.rivil.co.uk/api/send') && req.method() === 'POST'
		);
		await page.goto('/');
		const request = await beacon;
		expect(request.url()).toContain('umami.rivil.co.uk/api/send');
	});
});
