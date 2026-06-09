import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { expect, test } from 'vitest';
import MobileNav from './MobileNav.svelte';

const baseProps = {
	links: [
		{ label: 'Features', href: '/#features' },
		{ label: 'Docs', href: '/docs' }
	],
	githubHref: 'https://github.com/equerry-dev/equerry',
	downloadHref: '/#download'
};

function focusablesOf(panel: Element) {
	return Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
}

test('traps focus: Tab on the last item wraps to the first and back', async () => {
	await page.viewport(390, 844);
	let closed = false;
	const screen = render(MobileNav, { ...baseProps, open: true, onClose: () => (closed = true) });

	const panel = screen.getByRole('dialog').element();
	const items = focusablesOf(panel);
	expect(items.length).toBeGreaterThan(1);
	const first = items[0];
	const last = items[items.length - 1];

	last.focus();
	last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
	expect(document.activeElement).toBe(first);

	first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
	expect(document.activeElement).toBe(last);

	expect(closed).toBe(false);
});

test('Escape closes the drawer via onClose', async () => {
	await page.viewport(390, 844);
	let closed = false;
	const screen = render(MobileNav, { ...baseProps, open: true, onClose: () => (closed = true) });

	const panel = screen.getByRole('dialog').element();
	panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	expect(closed).toBe(true);
});
