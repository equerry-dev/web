import { render } from 'vitest-browser-svelte';
import { expect, test } from 'vitest';
import Features from './Features.svelte';

function rows(fromEl: Element): HTMLElement[] {
	return [...fromEl.ownerDocument.querySelectorAll<HTMLElement>('[data-side]')];
}

test('renders exactly three feature rows in order Capability-Slot, Privacy, FOSS', async () => {
	const screen = render(Features);
	const anchor = screen.getByRole('heading', { name: /capability-slot/i }).element();
	const titles = rows(anchor).map((r) => r.querySelector('h3')?.textContent?.trim());
	expect(titles).toEqual(['Capability-Slot', 'Privacy is the product', 'Open source on F-Droid']);
});

test('consecutive rows alternate the visual side', async () => {
	const screen = render(Features);
	const anchor = screen.getByRole('heading', { name: /capability-slot/i }).element();
	const sides = rows(anchor).map((r) => r.getAttribute('data-side'));
	for (let i = 1; i < sides.length; i++) {
		expect(sides[i]).not.toBe(sides[i - 1]);
	}
});

test('the Capability-Slot row carries a concrete example and a /docs learn-more link', async () => {
	const screen = render(Features);
	const row = screen
		.getByRole('heading', { name: /capability-slot/i })
		.element()
		.closest('[data-side]')!;
	expect(row.textContent).toMatch(/for example/i);
	expect(row.querySelector('a[href="/docs"]')).not.toBeNull();
});
