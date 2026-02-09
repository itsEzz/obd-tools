<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import LanguageSelect from './language-select.svelte';
	import ThemeToggle from './theme-toggle.svelte';

	// Variables
	const isMobile = new IsMobile();
</script>

<NavigationMenu.Root viewport={isMobile.current} class="mx-auto rounded-xl p-2 backdrop-blur">
	<NavigationMenu.List class="flex-wrap">
		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/" class={navigationMenuTriggerStyle()}>Home</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/svm" class={navigationMenuTriggerStyle()}>SVM</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/cc" class={navigationMenuTriggerStyle()}>Coding Compare</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/htb" class={navigationMenuTriggerStyle()}>Hex 2 Binary</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/prl" class={navigationMenuTriggerStyle()}>PR Codes Lookup</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/bc" class={navigationMenuTriggerStyle()}>Backup Converter</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href="/api-docs" class={navigationMenuTriggerStyle()}>API Docs</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		<ThemeToggle />

		<LanguageSelect />
	</NavigationMenu.List>
</NavigationMenu.Root>
