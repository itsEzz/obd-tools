<script lang="ts">
	import { version } from '$app/environment';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { m } from '$lib/paraglide/messages';
	import { cn } from '$lib/utils';
	import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';
	import GithubLogoIcon from 'phosphor-svelte/lib/GithubLogoIcon';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
	import UserCircleIcon from 'phosphor-svelte/lib/UserCircleIcon';
	import type { Component } from 'svelte';

	// Variables & States
	const linkItems: { title: string; link: string; ariaLabel: string; icon: Component }[] = [
		{
			title: m.link_personal_title(),
			link: 'https://adriangast.de',
			ariaLabel: m.link_personal_aria_label(),
			icon: UserCircleIcon
		},
		{
			title: m.link_github_title(),
			link: 'https://github.com/itsEzz/obd-tools',
			ariaLabel: m.link_github_aria_label(),
			icon: GithubLogoIcon
		},
		{
			title: m.link_forum_title(),
			link: 'https://forum.obdeleven.com/thread/12657/obd-tools-thirsty',
			ariaLabel: m.link_forum_aria_label(),
			icon: GlobeIcon
		}
	];
</script>

<footer
	class="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center border-t bg-background"
>
	<p class="text-sm text-muted-foreground text-center">
		Made with <span aria-hidden="true">❤️</span><span class="sr-only">love</span>
		by <Popover.Root>
			<Popover.Trigger
				class={cn(buttonVariants({ variant: 'link' }), 'p-0 text-sm')}
				data-umami-event="open-footer-link-popup"
			>
				Adrian Gast
			</Popover.Trigger>
			<Popover.Content class="flex flex-col max-w-fit">
				{#each linkItems as linkItem (linkItem.link)}
					<Item.Root variant="outline">
						{#snippet child({ props })}
							<a
								href={linkItem.link}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={linkItem.ariaLabel}
								{...props}
							>
								<Item.Media variant="icon">
									<linkItem.icon aria-hidden="true" />
								</Item.Media>
								<Item.Content>
									<Item.Title>{linkItem.title}</Item.Title>
								</Item.Content>
								<Item.Actions>
									<ArrowSquareOutIcon class="size-4" />
								</Item.Actions>
							</a>
						{/snippet}
					</Item.Root>
				{/each}
			</Popover.Content>
		</Popover.Root> | v{version}
	</p>
</footer>
