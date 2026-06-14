import { page } from '$app/state';
import { m } from '$lib/paraglide/messages';
import { prCodes } from '$lib/pr-codes';
import type { PrCodesResult } from '$lib/schemas/pr-codes';
import { umami } from '$lib/utils/umami';
import { tc, type Result } from '@itsezz/try-catch';

export function lookupPrCodes(
	codes: string[],
	onlyFoundCodes: boolean
): Result<PrCodesResult, unknown> {
	const result = tc(() =>
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

	umami.track(result.ok ? 'prl-success' : 'prl-error', {
		input: { codes, onlyFoundCodes },
		error: result.error ? String(result.error) : undefined
	});

	return result;
}

export function generatePrCodesBBCodeTable(prCodesResult: PrCodesResult, codes: string): string {
	const origin = page.url.origin;
	let code = `
        [table]
            [tbody0]
                [tr bgcolor="#D9D9D9"]
                    [td][center][font color="#000CFA"][b]${m.pr_codes_table_header_code()}[/b][/font][/center][/td]
                    [td][center][b]${m.pr_codes_table_header_code_group()}[/b][/center][/td]
                    [td][b]${m.pr_codes_table_header_description()}[/b][/td]
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
    [a href="${origin}/prl?codes=${codes.replaceAll(' ', '+')}"]${m.made_with_obd_tools()}[/a]`;
	return code;
}
