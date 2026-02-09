<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, locales, setLocale, type Locale } from '$lib/paraglide/runtime.js';
	import type { LanguageOption } from '$lib/types/locale';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '../ui/button';

	// Variables & States
	let currentLocale = $state<Locale>(getLocale());
	const availableLanguages: LanguageOption[] = [
		{ code: 'en', label: 'English' }
		// { code: 'de', label: 'Deutsch' }
	];

	// Handlers
	function handleChangeLocale(locale: string) {
		if (!(locales as readonly string[]).includes(locale)) {
			toast.error(m.language_select_error_title, {
				description: m.language_select_error_description({ locale })
			});
			return;
		}
		currentLocale = locale as Locale;
		setLocale(locale as Locale);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label={m.language_select_label()}
	>
		<GlobeIcon aria-hidden="true" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.RadioGroup value={currentLocale} onValueChange={handleChangeLocale}>
			{#each availableLanguages as language (language.code)}
				<DropdownMenu.RadioItem value={language.code}>
					{language.label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
