<script lang="ts">
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages';
	import SvelteSeo from 'svelte-seo';
</script>

<SvelteSeo title={m.website_title()} />

<ContentWindow>
	{#snippet body()}
		<div class="flex max-w-7xl flex-col items-center justify-center gap-4 lg:flex-row">
			<div class="flex flex-col items-center">
				<img src="/welcome.gif" class="max-w-sm" alt={m.home_welcome_gif_img_alt()} />
				<Button
					variant="link"
					href="https://tenor.com/view/ollie-owl-animation-tv-kids-gif-17328099"
					target="external _blank">{m.home_welcome_gif_source_link_label()}</Button
				>
			</div>
			<div class="text-center lg:text-start">
				<h1 class="text-2xl font-bold sm:text-3xl md:text-4xl">{m.home_welcome_title()}</h1>
				<h2 class="py-3 text-lg sm:text-xl md:text-2xl">{m.home_welcome_subtitle()}</h2>
				<p class="text-sm sm:text-base">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html m.home_welcome_description()}
				</p>
			</div>
		</div>
	{/snippet}
</ContentWindow>
