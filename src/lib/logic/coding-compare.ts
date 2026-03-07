import type { CodingCompareResult } from '$lib/types/coding-compare';
import { tc, type Result } from '@itsezz/try-catch';

export function codingCompare(value1: string, value2: string): Result<CodingCompareResult[]> {
	const results: CodingCompareResult[] = [];
	const byteCount = value1.length / 2;

	return tc(() => {
		for (let i = 0; i < byteCount; i++) {
			const startIdx = i * 2;
			const hex1 = value1.slice(startIdx, startIdx + 2).toUpperCase();
			const hex2 = value2.slice(startIdx, startIdx + 2).toUpperCase();

			const byte1 = parseInt(hex1, 16);
			const byte2 = parseInt(hex2, 16);

			const bits1 = createBits(byte1, byte2);
			const bits2 = createBits(byte2, byte1);

			const differs = byte1 !== byte2;

			results.push({
				byteNo: i < 10 ? '0' + i.toString() : i.toString(),
				differs,
				hex1,
				hex2,
				bits1,
				bits2
			});
		}

		return results;
	});
}

function createBits(byte: number, compareByte: number): CodingCompareResult['bits1'] {
	const bits: Partial<CodingCompareResult['bits1']> = {};

	for (let bitPos = 0; bitPos < 8; bitPos++) {
		const mask = 1 << bitPos;
		const isSet = (byte & mask) !== 0;
		const compareIsSet = (compareByte & mask) !== 0;
		const differs = isSet !== compareIsSet;

		bits[bitPos as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7] = {
			set: isSet,
			differs
		};
	}

	return bits as CodingCompareResult['bits1'];
}
