<script lang="ts">
	import { storeLinks } from '$lib/config/site';

	interface Props {
		/** Override the Google Play URL (defaults to the site config). */
		playStore?: string | null;
		/** Override the F-Droid URL (defaults to the site config). */
		fdroid?: string | null;
		class?: string;
	}

	let {
		playStore = storeLinks.playStore,
		fdroid = storeLinks.fdroid,
		class: cls = ''
	}: Props = $props();

	interface Store {
		name: string;
		url: string | null;
		badge: string;
		alt: string;
	}

	const stores = $derived<Store[]>([
		{
			name: 'Google Play',
			url: playStore,
			badge: '/badges/google-play.svg',
			alt: 'Get it on Google Play'
		},
		{
			name: 'F-Droid',
			url: fdroid,
			badge: '/badges/f-droid.svg',
			alt: 'Get it on F-Droid'
		}
	]);
</script>

<div class="flex flex-wrap items-center gap-3 {cls}">
	{#each stores as store (store.name)}
		{#if store.url}
			<!-- External store listing URLs (Google Play / F-Droid); not internal routes. -->
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href={store.url}
				class="inline-block rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<img src={store.badge} alt={store.alt} width="180" height="53" />
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{:else}
			<span
				class="inline-flex flex-col items-center gap-1"
				aria-disabled="true"
				title="{store.name} — coming soon"
			>
				<img src={store.badge} alt={store.alt} width="180" height="53" class="opacity-50" />
				<span class="text-xs font-medium text-muted">Coming soon</span>
			</span>
		{/if}
	{/each}
</div>
