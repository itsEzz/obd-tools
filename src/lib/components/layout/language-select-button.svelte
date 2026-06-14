<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, locales, setLocale, type Locale } from '$lib/paraglide/runtime.js';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '../ui/button';

	// Variables & States
	let currentLocale = $state<Locale>(getLocale());
	// ! Add new languages here
	const availableLanguages: {
		code: Locale;
		label: string;
	}[] = [
		{ code: 'en', label: 'English' },
		{ code: 'de', label: 'Deutsch' }
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
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<DropdownMenu.Trigger
					{...props}
					class={buttonVariants({ variant: 'outline', size: 'icon' })}
					aria-label={m.language_select_label()}
				>
					<GlobeIcon aria-hidden="true" />
				</DropdownMenu.Trigger>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{m.language_select_label()}</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{m.language_select_label()}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup value={currentLocale} onValueChange={handleChangeLocale}>
				{#each availableLanguages as language (language.code)}
					<DropdownMenu.RadioItem value={language.code}>
						{language.label}
					</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
