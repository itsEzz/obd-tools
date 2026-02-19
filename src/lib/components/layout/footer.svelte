<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { version } from '$app/environment';
</script>

<footer
	class="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center border-t bg-background"
>
	<p class="text-sm text-muted-foreground">
		Made with <span aria-hidden="true">❤️</span><span class="sr-only">love</span>
		by <Button
			variant="link"
			href="https://adriangast.de"
			target="_blank"
			rel="noreferrer"
			aria-label="Adrian Gast's Website (opens in new tab)"
			class="p-0">Adrian Gast</Button
		> | v{version}
	</p>
</footer>
