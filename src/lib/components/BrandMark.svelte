<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		class?: string;
	}

	let { class: cls = '' }: Props = $props();
</script>

<a href={resolve('/')} class="inline-flex items-center gap-2 {cls}" aria-label="Equerry — home">
	<!-- Real logo; light/dark swap follows the in-app theme toggle (.dark class). alt="" — the
	     wordmark + aria-label provide the accessible name, so the mark is decorative. -->
	<img src="/equerry-mark.svg" alt="" width="28" height="28" class="h-7 w-7 dark:hidden" />
	<img
		src="/equerry-mark-dark.svg"
		alt=""
		width="28"
		height="28"
		class="hidden h-7 w-7 dark:block"
	/>
	<span class="font-display text-lg font-extrabold tracking-tight text-text">Equerry</span>
</a>
