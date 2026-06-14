<script lang="ts">
	import { page } from '$app/state';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import { AnimatedGridPattern } from '$lib/components/magic/animated-grid-pattern';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import { cn } from '$lib/utils';
	import { mode, ModeWatcher } from 'mode-watcher';
	import SvelteSeo from 'svelte-seo';
	import './layout.css';

	// Props
	let { children } = $props();
</script>

<svelte:head>
	<!-- Favicon -->
	<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
	<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
	<!-- Apple -->
	<meta name="apple-mobile-web-app-title" content="App" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<!-- PWA -->
	<meta name="theme-color" content="#ffffff" />
	<link rel="manifest" href="/manifest.json" />
	<!-- Windows tiles -->
	<meta name="msapplication-TileColor" content="#ffffff" />
	<meta name="msapplication-config" content="/browserconfig.xml" />
</svelte:head>

<SvelteSeo
	title={m.website_title()}
	description={m.seo_website_description()}
	keywords={m.seo_website_keywords()}
	applicationName={m.website_title()}
	canonical={page.url.href}
	manifest="/manifest.json"
	openGraph={{
		title: m.website_title(),
		description: m.seo_website_description(),
		url: page.url.href,
		type: 'website',
		site_name: m.website_title(),
		images: [
			{
				url: new URL('/og.png', page.url.origin).href,
				width: 1200,
				height: 630,
				alt: m.website_title()
			}
		]
	}}
	twitter={{
		card: 'summary_large_image',
		title: m.website_title(),
		description: m.seo_website_description(),
		image: new URL('/og.png', page.url.origin).href,
		imageAlt: m.website_title()
	}}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: m.website_title(),
		description: m.seo_website_description(),
		url: page.url.href,
		operatingSystem: 'Web Browser',
		browserRequirements: 'Requires JavaScript. Requires HTML5.',
		permissions: 'no special permissions required',
		author: {
			'@type': 'Person',
			name: 'Adrian Gast',
			url: 'https://adriangast.de'
		}
	}}
/>

<ModeWatcher />

<Toaster
	theme={mode.current}
	duration={6000}
	closeButton
	position="top-right"
	toastOptions={{
		classes: {
			toast: '!rounded-none',
			closeButton: 'pointer-events-auto rounded-none!'
		}
	}}
/>

<a
	href="#main-content"
	class="focus:text-background-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-background focus:px-4 focus:py-2"
>
	{m.skip_to_main_content_label()}
</a>

<Tooltip.Provider>
	<div class="min-h-screen border flex flex-col">
		<Navbar />

		<div class="relative overflow-hidden flex-1">
			<main
				id="main-content"
				class="container mx-auto mt-4 mb-20 flex justify-center sm:mt-8 md:mt-12 lg:mt-16"
			>
				{@render children()}
			</main>
			<AnimatedGridPattern
				numSquares={30}
				maxOpacity={0.1}
				duration={3}
				repeatDelay={1}
				class={cn(
					'mask-[radial-gradient(1200px_circle_at_center,white,transparent)]',
					'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
				)}
			/>
		</div>
		<Footer />
	</div>
</Tooltip.Provider>
