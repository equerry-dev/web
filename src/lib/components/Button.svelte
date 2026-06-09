<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'ghost';

	interface Props {
		variant?: Variant;
		href?: string;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { variant = 'primary', href, class: cls = '', children, ...rest }: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors';

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-primary-ink hover:bg-primary-hover',
		ghost: 'border border-border text-text hover:bg-wash'
	};
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	class="{base} {variants[variant]} {cls}"
	{...rest}
>
	{#if children}{@render children()}{/if}
</svelte:element>
