import { hexToBinary } from '#lib/logic/hex-to-binary.js';
import type { BadRequestResponse, InternalServerErrorResponse } from '#lib/schemas/api.js';
import { hexToBinaryApiSchema, type HexToBinaryApiResponse } from '#lib/schemas/hex-to-binary.js';
import { createChildLogger } from '#lib/server/logger.js';
import { tca } from '@itsezz/try-catch';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.htb');

export const POST: RequestHandler = async ({ request }) => {
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return Response.json({ error: 'Invalid JSON body' } satisfies BadRequestResponse, {
			status: 400
		});
	}

	const validationResult = await hexToBinaryApiSchema.safeParseAsync(body.data);

	if (!validationResult.success) {
		logger.error('JSON Body validation failed');
		return Response.json(
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
			{ ...validationResult.data, err: hexToBinaryResult.error },
			'Hex to binary failed'
		);
		return Response.json(
			{ message: 'Hex to binary failed' } satisfies InternalServerErrorResponse,
			{
				status: 500
			}
		);
	}

	return Response.json({
		result: hexToBinaryResult.data
	} satisfies HexToBinaryApiResponse);
};
