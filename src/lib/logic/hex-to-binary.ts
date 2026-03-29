import { page } from '$app/state';
import type { HexToBinaryResult } from '$lib/schemas/hex-to-binary';
import { tc, type Result } from '@itsezz/try-catch';

export function hexToBinary(value: string, onlySetBytes: boolean): Result<HexToBinaryResult> {
	const results: HexToBinaryResult = [];
	const byteCount = value.length / 2;

	return tc(() => {
		for (let i = 0; i < byteCount; i++) {
			const startIdx = i * 2;
			const hex = value.slice(startIdx, startIdx + 2).toUpperCase();
			const byte = parseInt(hex, 16);

			if (byte === 0 && onlySetBytes) continue;

			const binary = byte.toString(2).padStart(8, '0');

			const bits: HexToBinaryResult[0]['bits'] = {
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

export function generateHexToBinaryBBCodeTable(
	hexToBinaryResult: HexToBinaryResult,
	hexVal: string
): string {
	const origin = page.url.origin;
	let code = `
		[table]
			[tbody0]
				[tr bgcolor="#D9D9D9"]
					[td][center][font color="#000CFA"][b]Byte No[/b][/font][/center][/td]
					[td][center][b]HEX[/b][/center][/td]
					[td][center][b]Bit 7[/b][/center][/td]
					[td][center][b]Bit 6[/b][/center][/td]
					[td][center][b]Bit 5[/b][/center][/td]
					[td][center][b]Bit 4[/b][/center][/td]
					[td][center][b]Bit 3[/b][/center][/td]
					[td][center][b]Bit 2[/b][/center][/td]
					[td][center][b]Bit 1[/b][/center][/td]
					[td][center][b]Bit 0[/b][/center][/td]
				[/tr]`;

	hexToBinaryResult.forEach((byte, idx) => {
		if (idx % 2 === 0) {
			code += '[tr bgcolor="#FFE699"]';
		} else {
			code += '[tr]';
		}

		code += `[td][center][font color="#000CFA"][b]${byte.byteNo}[/b][/font][/center][/td]`;
		code += `[td][center]${byte.hex}[/center][/td]`;
		Object.values(byte.bits)
			.reverse()
			.forEach((bitValue) => {
				if (bitValue) code += '[td][center][b]1[/b][/center][/td]';
				else code += '[td][center]0[/center][/td]';
			});
		code += '[/tr]';
	});
	code += `
	[/tbody0]
	[/table]
	[a href="${origin}/htb?hexValue=${hexVal}"]Made with OBD Tools[/a]`;
	return code;
}
