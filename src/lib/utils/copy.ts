import { browser } from '$app/environment';
import { isSuccess, tca } from '@itsezz/try-catch';
import { toast } from 'svelte-sonner';

/**
 * Checks if the clipboard API is supported in the current browser environment
 *
 * @param showToast - Whether to show a toast notification if clipboard is not supported
 * @returns Boolean indicating if clipboard operations are supported
 */
export function isCopySupported(showToast: boolean = false): boolean {
	if (!browser) return false;

	const isSupported = window.isSecureContext && 'clipboard' in navigator;

	if (showToast && !isSupported) {
		toast.info('Feature not supported', {
			description:
				"Either your browser doesn't support this feature or you're not in a secure context (HTTPS)."
		});
	}

	return isSupported;
}

/**
 * Copies the provided text to the clipboard
 *
 * This function checks for clipboard support before attempting to copy.
 * It uses the Clipboard API when available and handles errors gracefully.
 *
 * @param text - The text content to copy to clipboard
 * @param showToast - Whether to show toast notifications (default: true)
 * @returns Promise resolving to a boolean indicating success
 */
export async function copyText(text: string): Promise<boolean> {
	if (!isCopySupported(true)) return false;

	const result = await tca(navigator.clipboard.writeText(text));

	return isSuccess(result);
}
