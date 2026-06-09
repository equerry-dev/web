import { describe, it, expect } from 'vitest';
import { resolveInitialTheme } from './theme.svelte';

describe('resolveInitialTheme', () => {
	it('returns the stored theme when it is "dark"', () => {
		expect(resolveInitialTheme('dark', false)).toBe('dark');
	});

	it('returns the stored theme "light" even when the OS prefers dark', () => {
		expect(resolveInitialTheme('light', true)).toBe('light');
	});

	it('falls back to OS preference (dark) when nothing is stored', () => {
		expect(resolveInitialTheme(null, true)).toBe('dark');
	});

	it('falls back to light when nothing is stored and the OS prefers light', () => {
		expect(resolveInitialTheme(null, false)).toBe('light');
	});

	it('ignores an invalid stored value and uses OS preference', () => {
		expect(resolveInitialTheme('purple', true)).toBe('dark');
	});
});
