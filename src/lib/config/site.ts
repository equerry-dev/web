/**
 * Single source of truth for app store listings.
 *
 * URLs are `null` until the corresponding listing is live. Components that
 * render download CTAs must treat `null` as a "coming soon" / disabled state
 * and never emit a dead link. Flip a value to the real listing URL here and
 * every download CTA picks it up — no component change required.
 */
export interface StoreLinks {
	/** Google Play listing URL, or `null` until the listing is live. */
	playStore: string | null;
	/** F-Droid listing URL, or `null` until the listing is live. */
	fdroid: string | null;
}

export const storeLinks: StoreLinks = {
	playStore: null,
	fdroid: null
};

/**
 * Canonical origin the site is served from. Used to build absolute canonical
 * and Open Graph URLs. No trailing slash.
 */
export const siteUrl = 'https://equerry.dev';
