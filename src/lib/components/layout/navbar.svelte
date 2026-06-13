<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { m } from '$lib/paraglide/messages';
	import type { NavItem } from '$lib/types/navigation';
	import { cn } from '$lib/utils';
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import LanguageSelect from './language-select.svelte';
	import ThemeToggle from './theme-toggle.svelte';

	// Variables & States
	let isNavMenuOpen = $state<boolean>(false);
	const isMobile = new IsMobile();
	const navItems: NavItem[] = [
		{ href: '/svm', label: m.navbar_svm_label() },
		{ href: '/cc', label: m.navbar_coding_compare_label() },
		{ href: '/htb', label: m.navbar_hex_to_binary_label() },
		{ href: '/prl', label: m.navbar_pr_codes_lookup_label() },
		{ href: '/bc', label: m.navbar_backup_converter_label() },
		{ href: '/api-docs', label: m.navbar_api_docs_label() }
	];
</script>

<div class="sticky top-0 z-50 w-full" id="top">
	<div class="flex min-h-16 items-center border-b bg-background px-2">
		<div class="inline-flex w-1/2 items-center justify-start">
			<DropdownMenu.Root bind:open={isNavMenuOpen}>
				<DropdownMenu.Trigger
					class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'mr-2 lg:hidden')}
					aria-label={isNavMenuOpen ? m.navbar_close_menu_label() : m.navbar_open_menu_label()}
				>
					<ListIcon
						class={cn(
							'h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all!',
							isNavMenuOpen && 'scale-0 -rotate-90'
						)}
						aria-hidden="true"
					/>
					<XIcon
						class={cn(
							'absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all!',
							isNavMenuOpen && 'scale-100 rotate-0'
						)}
						aria-hidden="true"
					/>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					<DropdownMenu.Group class="space-y-1">
						{#each navItems as item (item.href)}
							<DropdownMenu.Item class={cn(page.url.pathname === item.href && 'bg-muted')}>
								<a href={resolve(item.href)}>
									{item.label}
								</a>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<a class={cn(buttonVariants({ variant: 'ghost' }), 'p-6 text-xl')} href={resolve('/')}>
				<img src={'/favicon-96x96.png'} alt={m.logo_alt()} class="size-12 hidden sm:block" />
				{m.website_title()}
			</a>
		</div>
		<div class="hidden shrink-0 lg:flex">
			<NavigationMenu.Root viewport={isMobile.current}>
				<NavigationMenu.List class="flex-wrap gap-2">
					{#each navItems as item (item.href)}
						<NavigationMenu.Item>
							<NavigationMenu.Link>
								{#snippet child()}
									<a
										href={resolve(item.href)}
										class={cn(
											navigationMenuTriggerStyle(),
											page.url.pathname === item.href && 'bg-muted'
										)}
									>
										{item.label}
									</a>
								{/snippet}
							</NavigationMenu.Link>
						</NavigationMenu.Item>
					{/each}
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</div>
		<div class="inline-flex w-1/2 justify-end gap-1">
			<ThemeToggle />
			<LanguageSelect />
		</div>
	</div>
</div>
