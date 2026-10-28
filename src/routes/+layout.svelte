<script lang="ts">
	import AnimatedGridPattern from '#lib/components/layout/animated-grid-pattern.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
	import Navbar from '#lib/components/layout/navbar.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { m } from '#lib/paraglide/messages.js';
	import { cn } from '#lib/utils.js';
	import {
		PUBLIC_UMAMI_DO_NOT_TRACK,
		PUBLIC_UMAMI_DOMAINS,
		PUBLIC_UMAMI_EXCLUDE_HASH,
		PUBLIC_UMAMI_EXCLUDE_SEARCH,
		PUBLIC_UMAMI_HOST_URL,
		PUBLIC_UMAMI_PERFORMANCE,
		PUBLIC_UMAMI_SCRIPT_URL,
		PUBLIC_UMAMI_TAG,
		PUBLIC_UMAMI_WEBSITE_ID
	} from '$app/env/public';
	import { page } from '$app/state';
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
	<!-- Analytics -->
	{#if PUBLIC_UMAMI_WEBSITE_ID && PUBLIC_UMAMI_SCRIPT_URL}
		<script
			defer
			src={PUBLIC_UMAMI_SCRIPT_URL}
			data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
			data-host-url={PUBLIC_UMAMI_HOST_URL}
			data-domains={PUBLIC_UMAMI_DOMAINS}
			data-tag={PUBLIC_UMAMI_TAG}
			data-performance={PUBLIC_UMAMI_PERFORMANCE}
			data-exclude-search={PUBLIC_UMAMI_EXCLUDE_SEARCH}
			data-exclude-hash={PUBLIC_UMAMI_EXCLUDE_HASH}
			data-do-not-track={PUBLIC_UMAMI_DO_NOT_TRACK}
		></script>
	{/if}
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
	<div class="flex min-h-screen flex-col">
		<Navbar />

		<div class="relative flex-1 overflow-hidden">
			<main
				id="main-content"
				class="mx-4 mt-4 mb-20 flex justify-center sm:container sm:mx-auto sm:mt-8 md:mt-12 lg:mt-16"
			>
				{@render children()}
			</main>
			<AnimatedGridPattern
				numSquares={50}
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
