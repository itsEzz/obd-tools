import { hexToBinary } from '$lib/logic/hex-to-binary';
import type { BadRequestResponse, InternalServerErrorResponse } from '$lib/schemas/api';
import { hexToBinaryApiSchema, type HexToBinaryApiResponse } from '$lib/schemas/hex-to-binary';
import { createChildLogger } from '$lib/server/logger';
import { umami } from '$lib/utils/umami';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.htb');

export const POST: RequestHandler = async ({ request }) => {
	await umami.track({ url: '/api/htb', title: 'Hex to Binary' });
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' } satisfies BadRequestResponse, { status: 400 });
	}

	const validationResult = await hexToBinaryApiSchema.safeParseAsync(body.data);

	if (!validationResult.success) {
		logger.error('JSON Body validation failed');
		return json(
			{
				error: 'JSON Body validation failed',
				issues: validationResult.error.issues
			} satisfies BadRequestResponse,
			{ status: 400 }
		);
	}

	const hexToBinaryResult = hexToBinary(
		validationResult.data.value,
		validationResult.data.onlySetBytes
	);
	if (!hexToBinaryResult.ok) {
		logger.error(
			{ ...validationResult.data, error: hexToBinaryResult.error },
			'Hex to binary failed'
		);
		return json({ message: 'Hex to binary failed' } satisfies InternalServerErrorResponse, {
			status: 500
		});
	}

	return json({
		result: hexToBinaryResult.data
	} satisfies HexToBinaryApiResponse);
};
