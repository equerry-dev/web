import { expect, test } from '@playwright/test';

test.describe('branded 404', () => {
	test('unknown path renders the branded error page inside the site shell', async ({ page }) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
		// The full site shell wraps the error page.
		await expect(page.locator('header')).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();
		// And it offers a way back.
		await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible();
	});
});
