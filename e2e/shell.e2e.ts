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

	test('home page has no axe violations in dark theme', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('equerry-theme', 'dark'));
		await page.goto('/');
		await expect(page.locator('html')).toHaveClass(/dark/);
		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations).toEqual([]);
	});

	test('a keyboard-focused element shows a visible focus ring', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const outlineStyle = await page.evaluate(
			() => getComputedStyle(document.activeElement as Element).outlineStyle
		);
		expect(outlineStyle).toBe('solid');
	});

	test('layout holds at 320px with no horizontal overflow', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 720 });
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});
});
