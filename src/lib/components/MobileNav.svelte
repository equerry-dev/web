<script lang="ts">
	import Button from './Button.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	interface NavLink {
		label: string;
		href: string;
	}

	interface Props {
		open: boolean;
		onClose: () => void;
		links: NavLink[];
		githubHref: string;
		downloadHref: string;
	}

	let { open, onClose, links, githubHref, downloadHref }: Props = $props();

	let panel = $state<HTMLElement | undefined>();

	function focusables(el: HTMLElement) {
		return Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
	}

	$effect(() => {
		if (!open || !panel) return;
		const el = panel;
		focusables(el)[0]?.focus();

		function onKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
				return;
			}
			if (e.key !== 'Tab') return;
			const items = focusables(el);
			if (items.length === 0) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}

		el.addEventListener('keydown', onKeydown);
		return () => el.removeEventListener('keydown', onKeydown);
	});
</script>

{#if open}
	<div class="fixed inset-0 z-40 bg-black/40 md:hidden" aria-hidden="true"></div>
	<div
		bind:this={panel}
		class="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80%] flex-col gap-1 border-l border-border bg-surface p-6 md:hidden"
		role="dialog"
		aria-modal="true"
		aria-label="Site menu"
	>
		<button
			type="button"
			class="mb-2 self-end text-muted hover:text-text"
			aria-label="Close menu"
			onclick={onClose}
		>
			<svg
				class="h-5 w-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M6 6l12 12M18 6 6 18" />
			</svg>
		</button>

		<!-- Internal links to routes built in later phases / hash anchors; site is root-deployed. -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		{#each links as link (link.href)}
			<a
				class="py-2 text-sm font-medium text-text hover:text-primary"
				href={link.href}
				onclick={onClose}>{link.label}</a
			>
		{/each}
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		<a
			class="py-2 text-sm font-medium text-text hover:text-primary"
			href={githubHref}
			rel="external">GitHub</a
		>
		<Button href={downloadHref} class="mt-2">Download</Button>
		<div class="mt-3"><ThemeToggle /></div>
	</div>
{/if}
