import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/demo'];

test.describe('site shell', () => {
	test('header and footer render on every route', async ({ page }) => {
		for (const path of ROUTES) {
			await page.goto(path);
			await expect(page.locator('header')).toBeVisible();
			await expect(page.locator('footer')).toBeVisible();
		}
	});

	test('skip-link is the first focusable element and moves focus to <main>', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const skip = page.getByRole('link', { name: 'Skip to content' });
		await expect(skip).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('main#main')).toBeFocused();
	});

	test('makes no third-party network requests', async ({ page, baseURL }) => {
		const host = new URL(baseURL ?? 'http://localhost:4173').host;
		const thirdParty: string[] = [];
		page.on('request', (req) => {
			const url = new URL(req.url());
			if (url.protocol === 'data:') return;
			if (url.host !== host) thirdParty.push(req.url());
		});
		for (const path of ROUTES) {
			await page.goto(path);
		}
		expect(thirdParty).toEqual([]);
	});

	test('home page has no axe accessibility violations', async ({ page }) => {
		await page.goto('/');
		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations).toEqual([]);
	});
});
