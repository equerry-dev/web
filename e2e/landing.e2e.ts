import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DIFFERENTIATORS = ['Capability-Slot', 'Privacy is the product', 'Open source on F-Droid'];
const VIEWPORTS = [
	{ name: 'mobile (320px)', width: 320, height: 720 },
	{ name: 'desktop', width: 1280, height: 800 }
];
// Pin to WCAG A + AA so the colour-contrast rule actually runs and backs c-4's
// "WCAG AA contrast" claim, rather than relying on axe's default rule set.
const AA_TAGS = ['wcag2a', 'wcag2aa'];

test.describe('landing page', () => {
	for (const vp of VIEWPORTS) {
		test(`shows all three differentiators and a download CTA at ${vp.name}`, async ({ page }) => {
			await page.setViewportSize({ width: vp.width, height: vp.height });
			await page.goto('/');
			for (const name of DIFFERENTIATORS) {
				await expect(page.getByRole('heading', { name })).toBeVisible();
			}
			// The download CTA (store badges) appears in the hero and the closing section.
			await expect(page.getByRole('img', { name: /google play/i }).first()).toBeVisible();
		});
	}

	test('has no axe AA violations in light theme', async ({ page }) => {
		await page.goto('/');
		const results = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
		expect(results.violations).toEqual([]);
	});

	test('has no axe AA violations in dark theme', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('equerry-theme', 'dark'));
		await page.goto('/');
		await expect(page.locator('html')).toHaveClass(/dark/);
		const results = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
		expect(results.violations).toEqual([]);
	});

	test('makes no third-party network requests', async ({ page, baseURL }) => {
		const host = new URL(baseURL ?? 'http://localhost:4173').host;
		const thirdParty: string[] = [];
		page.on('request', (req) => {
			const url = new URL(req.url());
			if (url.protocol === 'data:') return;
			if (url.host !== host) thirdParty.push(req.url());
		});
		await page.goto('/');
		expect(thirdParty).toEqual([]);
	});

	test('exposes the #features and #download anchor targets', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#features')).toBeVisible();
		await expect(page.locator('#download')).toBeVisible();
	});
});
