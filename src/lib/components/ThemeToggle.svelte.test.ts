import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import ThemeToggle from './ThemeToggle.svelte';
import { theme } from '$lib/theme.svelte';

test('clicking flips the theme store value and reflects it in aria-pressed', async () => {
	theme.set('light');
	const screen = render(ThemeToggle);
	const btn = screen.getByRole('button', { name: /toggle dark mode/i });

	await expect.element(btn).toHaveAttribute('aria-pressed', 'false');

	await btn.click();
	expect(theme.value).toBe('dark');
	await expect.element(btn).toHaveAttribute('aria-pressed', 'true');

	await btn.click();
	expect(theme.value).toBe('light');
});
