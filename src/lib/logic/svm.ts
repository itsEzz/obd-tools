import type { SvmResult } from '$lib/schemas/svm';
import { failure, tc, type Result } from '@itsezz/try-catch';

export function svmXor(value: string): Result<SvmResult> {
	switch (value.length) {
		case 5:
			return tc(() => (parseInt(value, 10) ^ parseInt('C9D2', 16)).toString(10));
		case 4:
			return tc(() => (parseInt(value, 16) ^ parseInt('C9D2', 16)).toString(16));
		default:
			return failure(new Error('Invalid input length'));
	}
}
