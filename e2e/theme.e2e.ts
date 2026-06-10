import { expect, test } from '@playwright/test';

// Exercises the pre-paint inline script in app.html (the no-flash mechanism).
test.describe('theme bootstrap (no-flash)', () => {
	test('honors OS dark preference on first visit', async ({ browser }) => {
		const context = await browser.newContext({ colorScheme: 'dark' });
		const page = await context.newPage();
		await page.goto('/');
		await expect(page.locator('html')).toHaveClass(/dark/);
		await context.close();
	});

	test('uses light on first visit when the OS prefers light', async ({ browser }) => {
		const context = await browser.newContext({ colorScheme: 'light' });
		const page = await context.newPage();
		await page.goto('/');
		await expect(page.locator('html')).not.toHaveClass(/dark/);
		await context.close();
	});

	test('applies a stored dark theme on load and across reload', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('equerry-theme', 'dark'));
		await page.goto('/');
		await expect(page.locator('html')).toHaveClass(/dark/);
		await page.reload();
		await expect(page.locator('html')).toHaveClass(/dark/);
	});

	test('a stored light theme overrides OS dark preference', async ({ browser }) => {
		const context = await browser.newContext({ colorScheme: 'dark' });
		const page = await context.newPage();
		await page.addInitScript(() => localStorage.setItem('equerry-theme', 'light'));
		await page.goto('/');
		await expect(page.locator('html')).not.toHaveClass(/dark/);
		await context.close();
	});
});

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
const MOBILE = { width: 320, height: 720 };

test.describe('responsive — no horizontal overflow at 320px', () => {
	for (const path of ROUTES) {
		for (const theme of ['light', 'dark'] as const) {
			test(`${path} (${theme}) holds at 320px`, async ({ page }) => {
				await page.setViewportSize(MOBILE);
				if (theme === 'dark') {
					await page.addInitScript(() => localStorage.setItem('equerry-theme', 'dark'));
				}
				await page.goto(path);
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth
				);
				expect(overflow, `${path} (${theme})`).toBeLessThanOrEqual(1);
			});
		}
	}
});
