import type { SvmResult } from '#lib/schemas/svm.js';
import { trackEvent } from '#lib/utils/umami.js';
import { failure, tc, type Result } from '@itsezz/try-catch';

export function svmXor(value: string): Result<SvmResult, unknown> {
	let result: Result<SvmResult, unknown>;

	if (value.length === 5)
		result = tc(() => (parseInt(value, 10) ^ parseInt('C9D2', 16)).toString(10));
	else if (value.length === 4)
		result = tc(() => (parseInt(value, 16) ^ parseInt('C9D2', 16)).toString(16));
	else result = failure(new Error('Invalid input length'));

	if (result.ok) void trackEvent('svm-success', { input: { value } });
	else
		void trackEvent('svm-error', {
			input: { value },
			error: JSON.stringify(result.error)
		});

	return result;
}
