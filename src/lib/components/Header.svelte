<script lang="ts">
	import { resolve } from '$app/paths';
	import BrandMark from './BrandMark.svelte';
	import Button from './Button.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import MobileNav from './MobileNav.svelte';

	interface NavLink {
		label: string;
		href: string;
	}

	const home = resolve('/');
	const navLinks: NavLink[] = [
		{ label: 'Features', href: `${home}#features` },
		{ label: 'Docs', href: '/docs' }
	];
	const githubHref = 'https://github.com/equerry-dev/equerry';
	const downloadHref = `${home}#download`;

	let open = $state(false);
	let hamburger = $state<HTMLButtonElement | undefined>();

	function close() {
		open = false;
		hamburger?.focus();
	}
</script>

<header class="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
	<nav
		class="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3"
		aria-label="Primary"
	>
		<BrandMark />

		<div class="hidden items-center gap-6 md:flex">
			{#each navLinks as link (link.href)}
				<!-- Internal links to routes built in later phases / hash anchors; site is root-deployed. -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a class="text-sm font-medium text-text hover:text-primary" href={link.href}>{link.label}</a
				>
			{/each}
			<a
				class="text-muted hover:text-text"
				href={githubHref}
				rel="external"
				aria-label="GitHub repository"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
					/>
				</svg>
			</a>
			<Button href={downloadHref}>Download</Button>
			<ThemeToggle />
		</div>

		<button
			bind:this={hamburger}
			type="button"
			class="text-text md:hidden"
			aria-label="Open menu"
			aria-expanded={open}
			onclick={() => (open = true)}
		>
			<svg
				class="h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M4 7h16M4 12h16M4 17h16" />
			</svg>
		</button>
	</nav>

	<MobileNav {open} onClose={close} links={navLinks} {githubHref} {downloadHref} />
</header>
