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
