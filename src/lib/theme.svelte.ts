import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

export const STORAGE_KEY = 'equerry-theme';

/**
 * Pure resolution of the initial theme. Shared logic between the store below and
 * the pre-paint inline script in app.html (kept in sync by hand).
 */
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
	if (stored === 'light' || stored === 'dark') return stored;
	return prefersDark ? 'dark' : 'light';
}

function readInitial(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem(STORAGE_KEY);
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	return resolveInitialTheme(stored, prefersDark);
}

let current = $state<Theme>(readInitial());

function apply(next: Theme) {
	current = next;
	if (browser) {
		localStorage.setItem(STORAGE_KEY, next);
		document.documentElement.classList.toggle('dark', next === 'dark');
	}
}

export const theme = {
	get value(): Theme {
		return current;
	},
	set: apply,
	toggle() {
		apply(current === 'dark' ? 'light' : 'dark');
	}
};
