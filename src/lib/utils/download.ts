import { browser } from '$app/env';
import { m } from '#lib/paraglide/messages.js';
import { tc } from '@itsezz/try-catch';
import { toast } from 'svelte-sonner';

/**
 * Checks if the download API is supported in the current browser environment
 *
 * @param showToast - Whether to show a toast notification if download is not supported
 * @returns Boolean indicating if download operations are supported
 */
export function isDownloadSupported(showToast: boolean = false): boolean {
	if (!browser) return false;

	const isSupported = window.isSecureContext && 'createElement' in document;

	if (showToast && !isSupported) {
		toast.info(m.util_not_supported_toast_title(), {
			description: m.util_not_supported_toast_description()
		});
	}

	return isSupported;
}

/**
 * Creates a file from a string input and triggers a download in the browser
 *
 * This function creates a Blob from the provided content string, generates
 * a temporary download URL, creates an anchor element, triggers the download,
 * and then cleans up by revoking the object URL.
 *
 * @param content - The string content to include in the downloaded file
 * @param filename - The name of the file to be downloaded (including extension)
 * @param mimeType - The MIME type of the file (default: 'text/plain')
 * @returns Boolean indicating if the download was successfully triggered
 */
export function downloadFile(
	content: string,
	filename: string,
	mimeType: string = 'text/plain'
): boolean {
	if (!isDownloadSupported(true)) return false;

	const result = tc(() => {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);

		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = filename;

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);

		URL.revokeObjectURL(url);
	});

	return result.ok;
}
