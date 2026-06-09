import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import FeatureRow from './FeatureRow.svelte';

test('exposes the configured side via data-side on the row root', async () => {
	const screen = render(FeatureRow, { title: 'Example', side: 'right', visualAlt: 'placeholder' });
	const heading = screen.getByRole('heading', { name: 'Example' }).element();
	expect(heading.closest('[data-side]')?.getAttribute('data-side')).toBe('right');
});

test('labels the placeholder visual for assistive tech', async () => {
	const screen = render(FeatureRow, { title: 'Example', side: 'left', visualAlt: 'a diagram' });
	// The placeholder is an empty, CSS-sized box, so assert it is present in the
	// accessibility tree with the right label rather than its (CSS-dependent) size.
	const visual = screen.getByRole('img', { name: 'a diagram' }).element();
	expect(visual.getAttribute('aria-label')).toBe('a diagram');
});
