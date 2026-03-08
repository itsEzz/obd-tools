import { browser } from '$app/environment';

/**
 * Scrolls the element with the given ID into view.
 *
 * Safely handles SSR by checking for browser environment before accessing the DOM.
 * If called on the server, the function returns early without any side effects.
 *
 * If the element doesn't exist yet (e.g., waiting for async rendering), the function
 * uses a MutationObserver to wait for the element to appear, with a 5-second timeout.
 *
 * @param id - The ID of the element to scroll into view
 * @param options - The scroll options (defaults to smooth behavior, start block, nearest inline)
 * @param offset - Optional top offset in pixels to account for sticky headers (defaults to 80)
 */
export function scrollIntoView(
	id: string,
	options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start', inline: 'nearest' },
	offset = 80
): void {
	if (!browser) return;

	const scrollToElement = (el: HTMLElement) => {
		const elementPosition = el.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: options.behavior
		});
	};

	const element = document.getElementById(id);

	if (element) {
		scrollToElement(element);
		return;
	}

	const observer = new MutationObserver((_, obs) => {
		const element = document.getElementById(id);
		if (element) {
			scrollToElement(element);
			obs.disconnect();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	setTimeout(() => observer.disconnect(), 5000);
}
