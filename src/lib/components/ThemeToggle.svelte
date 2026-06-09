<script lang="ts">
	import { theme } from '$lib/theme.svelte';

	const isDark = $derived(theme.value === 'dark');
</script>

<button
	type="button"
	class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text transition-colors hover:bg-wash"
	aria-pressed={isDark}
	aria-label="Toggle dark mode"
	onclick={() => theme.toggle()}
>
	{#if isDark}
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
		</svg>
	{:else}
		<svg
			class="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
			/>
		</svg>
	{/if}
</button>
