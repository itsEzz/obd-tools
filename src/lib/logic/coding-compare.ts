import { page } from '$app/state';
import type { CodingCompareResult } from '$lib/types/coding-compare';
import { tc, type Result } from '@itsezz/try-catch';

export function codingCompare(
	value1: string,
	value2: string,
	onlyDiff: boolean
): Result<CodingCompareResult[]> {
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

			if (onlyDiff && !differs) continue;

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

		bits[bitPos as keyof CodingCompareResult['bits1']] = {
			set: isSet,
			differs
		};
	}

	return bits as CodingCompareResult['bits1'];
}

export function generateCodingCompareBBCodeTable(
	codingCompareResult: CodingCompareResult[],
	hexVal1: string,
	hexVal2: string,
	onlyDiff: boolean
): string {
	const origin = page.url.origin;
	let code = `
	[table]
		[tbody0]
			[tr]
				[td][/td]
				[td colspan=2 bgcolor="#ffff00"][center][b]Hex value 1[/b][/center][/td]
				[td colspan=2 bgcolor="#ffff00"][center][b]Hex value 2[/b][/center][/td]
			[/tr]
			[tr bgcolor="#D9D9D9"]
				[td][center][font color="#000CFA"][b]Byte No[/b][/font][/center][/td]
				[td][center][b]HEX[/b][/center][/td]
				[td][center][b]BITS[/b][br][b]7 6 5 4 3 2 1 0[/b][/center][/td]
				[td][center][b]HEX[/b][/center][/td]
				[td][center][b]BITS[/b][br][b]7 6 5 4 3 2 1 0[/b][/center][/td]
			[/tr]`;

	codingCompareResult.forEach((byte, idx) => {
		if (idx % 2 === 0) {
			code += '[tr bgcolor="#FFE699"]';
		} else {
			code += '[tr]';
		}
		code += `[td][center][font color="#000CFA"][b]${byte.byteNo}[/b][/font][/center][/td]`;
		code += `[td][center]${byte.hex1}[/center][/td]`;
		code += '[td][center]';
		Object.values(byte.bits1)
			.reverse()
			.forEach(({ set, differs }) => {
				if (differs) {
					code += `[font color="#e61919"][b]${set ? '1' : '0'}[/b][/font] `;
				} else {
					code += `${set ? '1' : '0'} `;
				}
			});
		code += '[/center][/td]';
		code += `[td][center]${byte.hex2}[/center][/td]`;
		code += '[td][center]';
		Object.values(byte.bits2)
			.reverse()
			.forEach(({ set, differs }) => {
				if (differs) {
					code += `[font color="#e61919"][b]${set ? '1' : '0'}[/b][/font] `;
				} else {
					code += `${set ? '1' : '0'} `;
				}
			});
		code += '[/center][/td]';
		code += '[/tr]';
	});
	code += `
	[/tbody0]
	[/table]
	[a href="${origin}/cc?hexValue1=${hexVal1}&hexValue2=${hexVal2}&onlyDiff=${onlyDiff.toString()}"]Made with OBD Tools[/a]`;
	return code;
}
