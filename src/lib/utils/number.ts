/**
 * Converts a number into a human-readable format with suffixes
 *
 * This function formats numbers using metric suffixes (k, M, B, T)
 * for improved readability of large numbers.
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string with appropriate suffix
 */
export function toHumanReadable(value: number, decimals: number = 2): string {
	if (value === 0) return '0';

	const absValue = Math.abs(value);
	const sign = value < 0 ? '-' : '';

	const suffixes = ['', 'k', 'M', 'B', 'T'];
	const tier = Math.floor(Math.log10(absValue) / 3) || 0;

	if (tier === 0) {
		return sign + absValue.toString();
	}

	const suffix = suffixes[tier];
	const scale = Math.pow(10, tier * 3);
	const scaled = absValue / scale;

	return sign + scaled.toFixed(decimals) + suffix;
}
