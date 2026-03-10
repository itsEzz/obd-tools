<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import { mode, ModeWatcher } from 'mode-watcher';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<Toaster
	theme={mode.current}
	duration={6000}
	closeButton
	position="top-right"
	toastOptions={{
		classes: {
			closeButton: 'pointer-events-auto'
		}
	}}
/>

<a
	href="#main-content"
	class="focus:text-background-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2"
>
	{m.skip_to_main_content_label()}
</a>

<Tooltip.Provider>
	<Navbar />

	<main
		id="main-content"
		class="container mx-auto mt-4 mb-20 flex justify-center sm:mt-8 md:mt-12 lg:mt-16"
	>
		{@render children()}
	</main>

	<Footer />
</Tooltip.Provider>
