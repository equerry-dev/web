<script lang="ts">
	import { adjacent, docHref, docsNav, type DocGroup } from '$lib/docs/nav';

	interface Props {
		/** Slug of the current page; adjacency is resolved from the nav order. */
		current: string;
		nav?: DocGroup[];
	}

	let { current, nav = docsNav }: Props = $props();

	const adj = $derived(adjacent(current, nav));
</script>

<nav
	class="flex items-center justify-between gap-4 border-t border-border pt-6"
	aria-label="Pagination"
>
	<!-- Internal docs routes; site is root-deployed. -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	{#if adj.prev}
		<a
			href={docHref(adj.prev.slug)}
			rel="prev"
			aria-label={`Previous: ${adj.prev.title}`}
			class="text-sm font-medium text-muted hover:text-text"
		>
			<span aria-hidden="true">←</span>
			{adj.prev.title}
		</a>
	{:else}
		<span></span>
	{/if}

	{#if adj.next}
		<a
			href={docHref(adj.next.slug)}
			rel="next"
			aria-label={`Next: ${adj.next.title}`}
			class="text-right text-sm font-medium text-muted hover:text-text"
		>
			{adj.next.title}
			<span aria-hidden="true">→</span>
		</a>
	{/if}
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
</nav>
