<script lang="ts">
	import { version } from '$app/environment';
	import { Button } from '$lib/components/ui/button/index.js';
	import { m } from '$lib/paraglide/messages';
</script>

<footer
	class="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center border-t bg-background"
>
	<p class="text-sm text-muted-foreground text-center">
		Made with <span aria-hidden="true">❤️</span><span class="sr-only">love</span>
		by <Button
			variant="link"
			href="https://adriangast.de"
			target="_blank"
			rel="noreferrer"
			aria-label={m.adrian_website_link_aria_label()}
			class="p-0">Adrian Gast</Button
		> | v{version}
	</p>
</footer>
