import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Pin to WCAG A + AA so the colour-contrast rule runs, matching the docs/shell
// e2e and backing the "WCAG AA" criterion.
const AA_TAGS = ['wcag2a', 'wcag2aa'];

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

test.describe('a11y sweep — every route', () => {
	for (const path of ROUTES) {
		test(`${path} — no axe AA violations (light)`, async ({ page }) => {
			await page.goto(path);
			const results = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
			expect(results.violations, `${path} (light)`).toEqual([]);
		});

		test(`${path} — no axe AA violations (dark)`, async ({ page }) => {
			// Set the stored theme before navigation so the pre-paint script applies
			// .dark on first paint — axe then samples the final dark palette.
			await page.addInitScript(() => localStorage.setItem('equerry-theme', 'dark'));
			await page.goto(path);
			await expect(page.locator('html')).toHaveClass(/dark/);
			const results = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
			expect(results.violations, `${path} (dark)`).toEqual([]);
		});

		test(`${path} — interactive elements stay keyboard-reachable`, async ({ page }) => {
			await page.goto(path);
			// No visible link or button should be removed from the tab order.
			const unreachable = await page.locator('a[href], button:not([disabled])').evaluateAll((els) =>
				els
					.filter((el) => (el as HTMLElement).offsetParent !== null)
					.filter((el) => el.getAttribute('tabindex') === '-1')
					.map((el) => el.outerHTML)
			);
			expect(unreachable, `${path} keyboard-unreachable`).toEqual([]);
		});
	}
});
