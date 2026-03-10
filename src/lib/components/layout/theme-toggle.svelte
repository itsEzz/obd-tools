<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { mode, toggleMode } from 'mode-watcher';

	// Variables & States
	const ariaLabel = $derived(
		mode.current === 'dark' ? m.theme_switch_to_light_mode() : m.theme_switch_to_dark_mode()
	);
</script>

<Tooltip.Root>
	<Tooltip.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label={ariaLabel}
		onclick={toggleMode}
	>
		<SunIcon
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
			aria-hidden="true"
		/>
		<MoonIcon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			aria-hidden="true"
		/>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{ariaLabel}</p>
	</Tooltip.Content>
</Tooltip.Root>
