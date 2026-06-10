import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Pin to WCAG A + AA so the colour-contrast rule actually runs, matching the
// landing/shell e2e and backing the "WCAG AA contrast" criterion.
const AA_TAGS = ['wcag2a', 'wcag2aa'];
// Wide enough for the xl TOC rail to render alongside the sidebar.
const DESKTOP = { width: 1440, height: 900 };

// The setup walkthrough in reading order — the single source of truth the docs
// nav derives from. Used to assert prev/next traversal and no dead links.
const WALKTHROUGH = [
	{ slug: 'install', title: 'Install' },
	{ slug: 'default-assistant', title: 'Set as default assistant' },
	{ slug: 'add-a-provider', title: 'Add a provider' },
	{ slug: 'capability-slots', title: 'Capability Slots' }
];

test.describe('docs system', () => {
	test('sidebar marks the current page as aria-current', async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/install');
		const sidebar = page.getByRole('navigation', { name: 'Docs' });
		await expect(sidebar.getByRole('link', { name: 'Install', exact: true })).toHaveAttribute(
			'aria-current',
			'page'
		);
		await expect(sidebar.getByRole('link', { name: 'Capability Slots' })).not.toHaveAttribute(
			'aria-current'
		);
	});

	test('prev/next walks the setup pages in order with no prev on first, no next on last', async ({
		page
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto(`/docs/${WALKTHROUGH[0].slug}`);

		// First page: no prev, has next.
		let pager = page.getByRole('navigation', { name: 'Pagination' });
		await expect(pager.locator('a[rel="prev"]')).toHaveCount(0);
		await expect(pager.locator('a[rel="next"]')).toHaveCount(1);

		// Click forward through the whole walkthrough, asserting each URL in turn.
		for (let i = 1; i < WALKTHROUGH.length; i++) {
			await pager.locator('a[rel="next"]').click();
			await expect(page).toHaveURL(new RegExp(`/docs/${WALKTHROUGH[i].slug}$`));
			pager = page.getByRole('navigation', { name: 'Pagination' });
		}

		// Last page: has prev, no next.
		await expect(pager.locator('a[rel="next"]')).toHaveCount(0);
		await expect(pager.locator('a[rel="prev"]')).toHaveCount(1);
	});

	test('a TOC jump-link scrolls its section into view', async ({ page }) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/install');

		const toc = page.getByRole('navigation', { name: 'On this page' });
		await expect(toc).toBeVisible();

		await toc.getByRole('link', { name: 'Build from source' }).click();
		await expect(page).toHaveURL(/#build-from-source$/);
		await expect(page.locator('#build-from-source')).toBeInViewport();
	});

	test('keyboard focus shows a visible ring on sidebar, TOC and prev/next links', async ({
		page
	}) => {
		await page.setViewportSize(DESKTOP);
		await page.goto('/docs/install');

		const targets = [
			page
				.getByRole('navigation', { name: 'Docs' })
				.getByRole('link', { name: 'Capability Slots' }),
			page
				.getByRole('navigation', { name: 'On this page' })
				.getByRole('link', { name: 'Build from source' }),
			page.getByRole('navigation', { name: 'Pagination' }).getByRole('link', { name: /^Next/ })
		];

		for (const target of targets) {
			await target.focus();
			const outline = await target.evaluate((el) => getComputedStyle(el).outlineStyle);
			expect(outline).toBe('solid');
		}
	});

	test('has no axe AA violations on the index and a doc page, in light then dark', async ({
		page
	}) => {
		await page.setViewportSize(DESKTOP);

		for (const path of ['/docs', '/docs/add-a-provider']) {
			await page.goto(path);
			await expect(page.locator('html')).not.toHaveClass(/dark/);

			const light = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
			expect(light.violations, `${path} (light)`).toEqual([]);

			// Flip the theme via the UI toggle, then re-run axe against dark.
			await page.getByRole('button', { name: 'Toggle dark mode' }).first().click();
			await expect(page.locator('html')).toHaveClass(/dark/);
			// `transition-colors` animates token-driven colours; let it settle so axe
			// samples the final dark palette, not an intermediate frame.
			await page.waitForTimeout(400);

			const dark = await new AxeBuilder({ page }).withTags(AA_TAGS).analyze();
			expect(dark.violations, `${path} (dark)`).toEqual([]);

			// Reset to light for the next path (theme persists across navigation).
			await page.getByRole('button', { name: 'Toggle dark mode' }).first().click();
			await expect(page.locator('html')).not.toHaveClass(/dark/);
		}
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
		for (const { slug } of WALKTHROUGH) {
			await page.goto(`/docs/${slug}`);
		}
		expect(thirdParty).toEqual([]);
	});

	test('sidebar collapses behind a toggle at 320px and expands on click', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 720 });
		await page.goto('/docs/install');

		const toggle = page.getByRole('button', { name: 'Documentation' });
		// includeHidden so the locator resolves while the list is display:none.
		const navLink = page
			.getByRole('navigation', { name: 'Docs' })
			.getByRole('link', { name: 'Capability Slots', includeHidden: true });

		// Below md the list is collapsed behind the visible toggle (real CSS, not just the class).
		await expect(toggle).toBeVisible();
		await expect(navLink).toBeHidden();

		await toggle.click();
		await expect(navLink).toBeVisible();

		// The docs layout holds at 320px with no horizontal overflow.
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(1);
	});

	// — Content fidelity (r-03): each page must match real app behaviour —

	test('index shows the "what works today" maturity callout', async ({ page }) => {
		await page.goto('/docs');
		await expect(page.getByText('What works today')).toBeVisible();
		await expect(page.getByText(/building from source/i)).toBeVisible();
		await expect(page.getByText(/coming soon/i).first()).toBeVisible();
	});

	test('install page documents build-from-source, with stores marked coming soon', async ({
		page
	}) => {
		await page.goto('/docs/install');
		// Real install method that works today.
		await expect(page.getByText(/assembleDebug/).first()).toBeVisible();
		await expect(page.getByText(/build from source/i).first()).toBeVisible();
		// Stores are not yet available — must be framed as coming soon, not working.
		await expect(page.getByRole('heading', { name: /coming soon/i })).toBeVisible();
		await expect(page.getByText('Google Play').first()).toBeVisible();
		await expect(page.getByText('F-Droid').first()).toBeVisible();
	});

	test('default-assistant page documents the Android settings path', async ({ page }) => {
		await page.goto('/docs/default-assistant');
		await expect(page.getByText(/Default apps/).first()).toBeVisible();
		await expect(page.getByText(/Digital assistant/i).first()).toBeVisible();
		await expect(page.getByText('Equerry assistant').first()).toBeVisible();
	});

	test('add-a-provider page lists all four provider types and key handling', async ({ page }) => {
		await page.goto('/docs/add-a-provider');
		for (const type of ['Ollama', 'Anthropic', 'OpenAI-compatible', 'OpenRouter']) {
			await expect(page.getByText(type).first()).toBeVisible();
		}
		await expect(page.getByText(/no API key/i).first()).toBeVisible();
		await expect(page.getByText(/encrypted/i).first()).toBeVisible();
	});

	test('capability-slots page wires Chat and marks the rest coming soon', async ({ page }) => {
		await page.goto('/docs/capability-slots');
		await expect(page.getByText(/Available now/i).first()).toBeVisible();
		// The inactive slots are present but explicitly not yet available.
		for (const slot of ['Vision', 'Speech-to-text', 'Text-to-speech', 'OCR', 'Embeddings']) {
			await expect(page.getByText(slot).first()).toBeVisible();
		}
		await expect(page.getByText(/coming soon/i).first()).toBeVisible();
		await expect(page.getByText(/Map provider/).first()).toBeVisible();
	});
});
