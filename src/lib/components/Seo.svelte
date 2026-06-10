<script lang="ts">
	import { page } from '$app/state';
	import { siteUrl } from '$lib/config/site';

	interface Props {
		/** Full document title for this page. */
		title: string;
		/** Meta description for this page. */
		description: string;
		/**
		 * Route path used to build the canonical URL. Defaults to the current
		 * page's pathname. Pass explicitly in unit tests so the component does not
		 * depend on SvelteKit page context.
		 */
		path?: string;
		/** Absolute site-root path to the Open Graph / Twitter card image. */
		image?: string;
	}

	let { title, description, path, image = '/og-default.png' }: Props = $props();

	const canonical = $derived(`${siteUrl}${path ?? page.url.pathname}`);
	const imageUrl = $derived(`${siteUrl}${image}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Equerry" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
