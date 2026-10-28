<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface AnimatedGridPatternProps extends HTMLAttributes<SVGElement> {
		width?: number;
		height?: number;
		x?: number;
		y?: number;
		strokeDasharray?: number;
		numSquares?: number;
		maxOpacity?: number;
		duration?: number;
		repeatDelay?: number;
		class?: string;
	}

	let {
		width = 40,
		height = 40,
		x = -1,
		y = -1,
		strokeDasharray = 0,
		numSquares = 50,
		class: className,
		maxOpacity = 0.5,
		duration = 4,
		repeatDelay = 0.5,
		...props
	}: AnimatedGridPatternProps = $props();

	const id = $props.id();
	let containerRef: SVGSVGElement | null = $state(null);
	let dimensions = $state({ width: 800, height: 600 });

	onMount(() => {
		const el = containerRef;
		if (!el) return;

		const ro = new ResizeObserver(([entry]) => {
			const { width: w, height: h } = entry.contentRect;
			if (w && h && (dimensions.width !== w || dimensions.height !== h)) {
				dimensions = { width: w, height: h };
			}
		});

		ro.observe(el);
		return () => ro.disconnect();
	});

	function animateSquare(el: SVGRectElement, i: number) {
		el.setAttribute('opacity', '0');

		const total = duration * 1000 * 2 + repeatDelay * 1000;
		const fade = (duration * 1000) / total;
		const pause = (duration * 1000 + repeatDelay * 1000) / total;

		let anim: Animation | null = null;
		let dead = false;

		const cycle = () => {
			if (dead) return;

			const cols = Math.max(1, Math.floor(dimensions.width / width));
			const rows = Math.max(1, Math.floor(dimensions.height / height));
			el.setAttribute('x', String(((Math.random() * cols) | 0) * width + 1));
			el.setAttribute('y', String(((Math.random() * rows) | 0) * height + 1));

			anim = el.animate(
				[
					{ opacity: 0 },
					{ opacity: maxOpacity, offset: fade },
					{ opacity: maxOpacity, offset: pause },
					{ opacity: 0 }
				],
				{ duration: total, delay: i * 100, easing: 'ease' }
			);

			anim.onfinish = () => {
				el.setAttribute('opacity', '0');
				cycle();
			};
		};

		cycle();
		return {
			destroy: () => {
				dead = true;
				anim?.cancel();
			}
		};
	}
</script>

<svg
	bind:this={containerRef}
	aria-hidden="true"
	class={cn(
		'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
		className
	)}
	{...props}
>
	<defs>
		<pattern {id} {width} {height} patternUnits="userSpaceOnUse" {x} {y}>
			<path d={`M.5 ${height}V.5H${width}`} fill="none" stroke-dasharray={strokeDasharray} />
		</pattern>
	</defs>
	<rect width="100%" height="100%" fill={`url(#${id})`} />
	<svg {x} {y} class="overflow-visible">
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each Array.from({ length: numSquares }) as _, i (i)}
			<rect
				use:animateSquare={i}
				width={width - 1}
				height={height - 1}
				x={1}
				y={1}
				fill="currentColor"
				stroke-width="0"
			/>
		{/each}
	</svg>
</svg>
