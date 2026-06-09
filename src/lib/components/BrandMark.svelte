<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		class?: string;
	}

	let { class: cls = '' }: Props = $props();
</script>

<a href={resolve('/')} class="inline-flex items-center gap-2 {cls}" aria-label="Equerry — home">
	<!-- Placeholder geometric mark (self-made stand-in until a real logo exists). -->
	<svg class="h-7 w-7 text-primary" viewBox="0 0 32 32" fill="none" aria-hidden="true">
		<rect x="3" y="3" width="26" height="26" rx="8" stroke="currentColor" stroke-width="2.5" />
		<path
			d="M11 11h10M11 16h7M11 21h10"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
		/>
	</svg>
	<span class="font-display text-lg font-extrabold tracking-tight text-text">Equerry</span>
</a>
