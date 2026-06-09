<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Row heading. */
		title: string;
		/** Which column the visual sits in on desktop. Rows alternate this. */
		side?: 'left' | 'right';
		/** Accessible label for the placeholder visual. */
		visualAlt: string;
		/** Row body: tagline, copy, example, links. */
		children?: Snippet;
	}

	let { title, side = 'left', visualAlt, children }: Props = $props();
</script>

<div
	data-side={side}
	class="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 lg:grid-cols-2"
>
	<div class={side === 'right' ? 'lg:order-2' : ''}>
		<h3 class="font-display text-2xl font-bold text-text">{title}</h3>
		<div class="mt-4 max-w-prose text-muted">
			{#if children}{@render children()}{/if}
		</div>
	</div>
	<div class={side === 'right' ? 'lg:order-1' : ''}>
		<div
			class="aspect-[4/3] w-full rounded-2xl border border-border bg-wash"
			role="img"
			aria-label={visualAlt}
		></div>
	</div>
</div>
