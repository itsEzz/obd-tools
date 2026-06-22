<script lang="ts">
	import ContentWindow from '$lib/components/layout/content-window.svelte';
	import Marquee from '$lib/components/magic/marquee/marquee.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import { m } from '$lib/paraglide/messages';
	import BracketsCurlyIcon from 'phosphor-svelte/lib/BracketsCurlyIcon';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import DeviceMobileIcon from 'phosphor-svelte/lib/DeviceMobileIcon';
	import LayoutIcon from 'phosphor-svelte/lib/LayoutIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import LockIcon from 'phosphor-svelte/lib/LockIcon';
	import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';
	import TranslateIcon from 'phosphor-svelte/lib/TranslateIcon';
	import type { Component } from 'svelte';
	import SvelteSeo from 'svelte-seo';
	import { blur } from 'svelte/transition';

	// Variables & States
	type MarqueeItem = {
		icon: Component;
		title: string;
		description: string;
	};
	const marqueeItems: MarqueeItem[] = [
		{
			icon: LightningIcon,
			title: m.home_marquee_item_1_title(),
			description: m.home_marquee_item_1_description()
		},
		{
			icon: DeviceMobileIcon,
			title: m.home_marquee_item_2_title(),
			description: m.home_marquee_item_2_description()
		},
		{
			icon: CodeIcon,
			title: m.home_marquee_item_3_title(),
			description: m.home_marquee_item_3_description()
		},
		{
			icon: LayoutIcon,
			title: m.home_marquee_item_4_title(),
			description: m.home_marquee_item_4_description()
		},
		{
			icon: TranslateIcon,
			title: m.home_marquee_item_5_title(),
			description: m.home_marquee_item_5_description()
		},
		{
			icon: BracketsCurlyIcon,
			title: m.home_marquee_item_6_title(),
			description: m.home_marquee_item_6_description()
		},
		{
			icon: SparkleIcon,
			title: m.home_marquee_item_7_title(),
			description: m.home_marquee_item_7_description()
		},
		{
			icon: LockIcon,
			title: m.home_marquee_item_8_title(),
			description: m.home_marquee_item_8_description()
		}
	];

	let firstRow = $derived(marqueeItems.slice(0, marqueeItems.length / 2));
	let secondRow = $derived(marqueeItems.slice(marqueeItems.length / 2));
</script>

<SvelteSeo title={m.website_title()} />

{#snippet marqueeItem(item: MarqueeItem)}
	<Item.Root variant="outline" class="max-w-60 sm:max-w-sm md:max-w-none hover:bg-muted/50 ">
		<Item.Media class="h-full">
			<item.icon aria-hidden="true" class="size-6" />
		</Item.Media>
		<Item.Content class="h-full justify-center">
			<Item.Title>{item.title}</Item.Title>
			<Item.Description>{item.description}</Item.Description>
		</Item.Content>
	</Item.Root>
{/snippet}

<ContentWindow>
	{#snippet body()}
		<div class="flex flex-col gap-2">
			<div
				class="flex max-w-7xl flex-col items-center justify-center gap-4 lg:flex-row"
				in:blur={{ duration: 500 }}
			>
				<div class="flex flex-col items-center">
					<img src="/welcome.gif" class="max-w-sm" alt={m.home_welcome_gif_img_alt()} />
					<Button
						variant="link"
						href="https://tenor.com/view/ollie-owl-animation-tv-kids-gif-17328099"
						target="external _blank">{m.home_welcome_gif_source_link_label()}</Button
					>
				</div>
				<div class="text-center lg:text-start">
					<h1 class="text-2xl font-bold sm:text-3xl md:text-4xl">
						{m.home_welcome_title()}
					</h1>
					<h2 class="py-3 text-lg sm:text-xl md:text-2xl">
						{m.home_welcome_subtitle()}
					</h2>
					<p class="text-sm sm:text-base">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html m.home_welcome_description()}
					</p>
				</div>
			</div>
			<div
				class="relative flex w-full flex-col items-center justify-center overflow-hidden"
				in:blur={{ delay: 100, duration: 500 }}
			>
				<Marquee pauseOnHover class="[--duration:25s] w-full">
					{#each firstRow as item (item.title)}
						{@render marqueeItem(item)}
					{/each}
				</Marquee>
				<Marquee reverse pauseOnHover class="[--duration:25s] w-full">
					{#each secondRow as item (item.title)}
						{@render marqueeItem(item)}
					{/each}
				</Marquee>
				<div
					class="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"
				></div>
				<div
					class="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"
				></div>
			</div>
		</div>
	{/snippet}
</ContentWindow>
