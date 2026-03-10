import type { HexToBinaryResult } from '$lib/types/hex-to-binary';
import { tc, type Result } from '@itsezz/try-catch';

export function hexToBinary(value: string): Result<HexToBinaryResult[]> {
	const results: HexToBinaryResult[] = [];
	const byteCount = value.length / 2;

	return tc(() => {
		for (let i = 0; i < byteCount; i++) {
			const startIdx = i * 2;
			const hex = value.slice(startIdx, startIdx + 2).toUpperCase();
			const byte = parseInt(hex, 16);

			const binary = byte.toString(2).padStart(8, '0');

			const bits: HexToBinaryResult['bits'] = {
				0: (byte & 0x01) !== 0,
				1: (byte & 0x02) !== 0,
				2: (byte & 0x04) !== 0,
				3: (byte & 0x08) !== 0,
				4: (byte & 0x10) !== 0,
				5: (byte & 0x20) !== 0,
				6: (byte & 0x40) !== 0,
				7: (byte & 0x80) !== 0
			};

			results.push({
				byteNo: i < 10 ? '0' + i.toString() : i.toString(),
				hex,
				binary,
				bits
			});
		}

		return results;
	});
}
