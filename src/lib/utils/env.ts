import type z from 'zod/v4';

/**
 * Converts all empty string values in the given object to `undefined`.
 *
 * @template T - The type of the input and output object.
 * @param {T} obj - The input object whose empty string values will be replaced.
 * @returns {T} A new object with empty string values replaced by `undefined`.
 */
export function emptyStringsToUndefined<T extends Record<string, string | undefined>>(obj: T): T {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, value?.trim() === '' ? undefined : value])
	) as T;
}

/**
 * Formats a Zod validation error into a readable string.
 *
 * @param {z.ZodError} error - The Zod validation error to format.
 * @returns {string} A formatted string representing the validation errors.
 */
export function formatValidationError(error: z.ZodError): string {
	const errorMessages = error.issues.map((err) => {
		const path = err.path.join('.');
		return `- ${path}: ${err.message}`;
	});

	return `Environment Validation Failed:\n${errorMessages.join('\n')}\n\nPlease check your .env file / variables and ensure all required variables are set with valid values.`;
}
