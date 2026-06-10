import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Pin to WCAG A + AA so the colour-contrast rule actually runs, matching the
// landing/shell e2e and backing c-4's "WCAG AA contrast" claim.
const AA_TAGS = ['wcag2a', 'wcag2aa'];
// Wide enough for the xl TOC rail to render alongside the sidebar.
const DESKTOP = { width: 1440, height: 900 };

test.describe('docs system', () => {
	test('sidebar marks the current page as aria-current', async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/getting-started');
		const sidebar = page.getByRole('navigation', { name: 'Docs' });
		await expect(sidebar.getByRole('link', { name: 'Getting Started' })).toHaveAttribute(
			'aria-current',
			'page'
		);
		await expect(sidebar.getByRole('link', { name: 'Configuration' })).not.toHaveAttribute(
			'aria-current'
		);
	});

	test('prev/next walks first -> last with no prev on first and no next on last', async ({
		page
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/getting-started');

		const pager = page.getByRole('navigation', { name: 'Pagination' });
		await expect(pager.locator('a[rel="prev"]')).toHaveCount(0);
		await expect(pager.locator('a[rel="next"]')).toHaveCount(1);

		await pager.locator('a[rel="next"]').click();
		await expect(page).toHaveURL(/\/docs\/configuration$/);

		const lastPager = page.getByRole('navigation', { name: 'Pagination' });
		await expect(lastPager.locator('a[rel="next"]')).toHaveCount(0);
		await expect(lastPager.locator('a[rel="prev"]')).toHaveCount(1);
	});

	test('a TOC jump-link scrolls its section into view', async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/getting-started');

		const toc = page.getByRole('navigation', { name: 'On this page' });
		await expect(toc).toBeVisible();

		await toc.getByRole('link', { name: 'Confirm the setting' }).click();
		await expect(page).toHaveURL(/#confirm-the-setting$/);
		await expect(page.locator('#confirm-the-setting')).toBeInViewport();
	});

	test('keyboard focus shows a visible ring on sidebar, TOC and prev/next links', async ({
		page
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/getting-started');

		const targets = [
			page.getByRole('navigation', { name: 'Docs' }).getByRole('link', { name: 'Configuration' }),
			page
				.getByRole('navigation', { name: 'On this page' })
				.getByRole('link', { name: 'Install the app' }),
			page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: /^Next/ })
		];

		for (const target of targets) {
			await target.focus();
			const outline = await target.evaluate((el) => getComputedStyle(el).outlineStyle);
			expect(outline).toBe('solid');
		}
	});

	test('has no axe AA violations in light, then dark after toggling the theme', async ({
		page
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/getting-started');
		await expect(page.locator('html')).not.toHaveClass(/dark/);

		const light = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
		expect(light.violations).toEqual([]);

		// Actually flip the theme via the UI toggle, then re-run axe against dark.
		await page.getByRole('button', { name: 'Toggle dark mode' }).first().click();
		await expect(page.locator('html')).toHaveClass(/dark/);
		// `transition-colors` animates token-driven colours; let it settle so axe
		// samples the final dark palette, not an intermediate frame.
		await page.waitForTimeout(400);

		const dark = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
		expect(dark.violations).toEqual([]);
	});

	test('makes no third-party network requests across the docs section', async ({
		page,
		baseURL
	}) => {
		const host = new URL(baseURL ?? 'http://localhost:4173').host;
		const thirdParty: string[] = [];
		page.on('request', (req) => {
			const url = new URL(req.url());
			if (url.protocol === 'data:') return;
			if (url.host !== host) thirdParty.push(req.url());
		});

		await page.goto('/docs');
		await page.goto('/docs/getting-started');
		await page.goto('/docs/configuration');
		expect(thirdParty).toEqual([]);
	});
});
