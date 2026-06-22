import type { SvmResult } from '$lib/schemas/svm';
import { umami } from '$lib/utils/umami';
import { failure, tc, type Result } from '@itsezz/try-catch';

export function svmXor(value: string): Result<SvmResult, unknown> {
	let result: Result<SvmResult, unknown>;

	if (value.length === 5)
		result = tc(() => (parseInt(value, 10) ^ parseInt('C9D2', 16)).toString(10));
	else if (value.length === 4)
		result = tc(() => (parseInt(value, 16) ^ parseInt('C9D2', 16)).toString(16));
	else result = failure(new Error('Invalid input length'));

	umami.track(result.ok ? 'svm-success' : 'svm-error', {
		input: { value },
		error: result.error ? String(result.error) : undefined
	});

	return result;
}
