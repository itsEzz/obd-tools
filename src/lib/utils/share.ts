import { browser } from '$app/environment';
import { m } from '$lib/paraglide/messages';
import { isSuccess, tca } from '@itsezz/try-catch';
import { toast } from 'svelte-sonner';

/**
 * Checks if the Web Share API is supported in the current browser environment
 *
 * The Web Share API requires a secure context (HTTPS) and browser support.
 * This function can optionally show a toast notification if sharing is not supported.
 *
 * @param showToast - Whether to show a toast notification if sharing is not supported
 * @returns Boolean indicating if the Web Share API is available
 */
export function isShareSupported(showToast: boolean = false): boolean {
	if (!browser) return false;

	const isSupported = window.isSecureContext && 'share' in navigator;

	if (showToast && !isSupported) {
		toast.info(m.util_not_supported_toast_title(), {
			description: m.util_not_supported_toast_description()
		});
	}

	return isSupported;
}

/**
 * Shares content using the Web Share API
 *
 * This function allows sharing text, URLs, and titles via the device's
 * native sharing mechanism. It checks for API support before attempting to share.
 *
 * @param title - The title of the content being shared
 * @param text - The text content to share
 * @param url - The URL to share
 * @returns Promise resolving to a boolean indicating success
 */
export async function shareText(title?: string, text?: string, url?: string): Promise<boolean> {
	if (!isShareSupported(true)) return false;

	const result = await tca(navigator.share({ title, text, url }));

	return result.ok;
}
