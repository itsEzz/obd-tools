<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { m } from '$lib/paraglide/messages';
	import { mode, toggleMode } from 'mode-watcher';
	import MoonIcon from 'phosphor-svelte/lib/MoonIcon';
	import SunIcon from 'phosphor-svelte/lib/SunIcon';

	// Variables & States
	let buttonRef = $state<HTMLButtonElement | null>(null);
	const ariaLabel = $derived(
		mode.current === 'dark' ? m.theme_switch_to_light_mode() : m.theme_switch_to_dark_mode()
	);

	// Handlers
	async function handleClickToggleTheme() {
		if (!buttonRef) return;

		if (!document.startViewTransition) {
			toggleMode();
			return;
		}

		await document.startViewTransition(() => {
			toggleMode();
		}).ready;

		const { top, left, width, height } = buttonRef.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const maxRadius = Math.hypot(
			Math.max(left, window.innerWidth - left),
			Math.max(top, window.innerHeight - top)
		);

		document.documentElement.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`]
			},
			{
				duration: 400,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)'
			}
		);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger
		bind:ref={buttonRef}
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label={ariaLabel}
		onclick={handleClickToggleTheme}
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
