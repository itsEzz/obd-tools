import { page } from '$app/state';
import { m } from '$lib/paraglide/messages';
import { prCodes } from '$lib/pr-codes';
import type { PrCodeResult } from '$lib/types/pr-codes';
import { tc, type Result } from '@itsezz/try-catch';

export function lookupPrCodes(codes: string[], onlyFoundCodes: boolean): Result<PrCodeResult[]> {
	return tc(() =>
		[...new Set(codes)]
			.map((code) => {
				const prCodeInfo = prCodes.find((item) => item.code.toLowerCase() === code.toLowerCase());

				if (prCodeInfo) return prCodeInfo;

				if (onlyFoundCodes) return;

				return {
					code,
					codeGroup: m.pr_codes_unknown(),
					description: m.pr_codes_unknown()
				};
			})
			.filter((item) => item !== undefined)
	);
}

export function generatePrCodesBBCodeTable(prCodesResult: PrCodeResult[], codes: string): string {
	const origin = page.url.origin;
	let code = `
        [table]
            [tbody0]
                [tr bgcolor="#D9D9D9"]
                    [td][center][font color="#000CFA"][b]PR code[/b][/font][/center][/td]
                    [td][center][b]Code group[/b][/center][/td]
                    [td][b]Description[/b][/td]
                [/tr]`;

	prCodesResult.forEach((prCode, idx) => {
		if (idx % 2 === 0) {
			code += '[tr bgcolor="#FFE699"]';
		} else {
			code += '[tr]';
		}

		code += `[td][center][font color="#000CFA"][b]${prCode.code}[/b][/font][/center][/td]`;
		code += `[td][center]${prCode.codeGroup}[/center][/td]`;
		code += `[td]${prCode.description}[/td]`;
		code += '[/tr]';
	});
	code += `
    [/tbody0]
    [/table]
    [a href="${origin}/prl?codes=${codes.replaceAll(' ', '+')}"]Made with OBD Tools[/a]`;
	return code;
}
