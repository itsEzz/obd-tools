import { lookupPrCodes } from '#lib/logic/pr-codes.js';
import type { BadRequestResponse, InternalServerErrorResponse } from '#lib/schemas/api.js';
import { prCodesApiSchema, type PrCodesApiResponse } from '#lib/schemas/pr-codes.js';
import { createChildLogger } from '#lib/server/logger.js';
import { tca } from '@itsezz/try-catch';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.prl');

export const POST: RequestHandler = async ({ request }) => {
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return Response.json({ error: 'Invalid JSON body' } satisfies BadRequestResponse, {
			status: 400
		});
	}

	const validationResult = await prCodesApiSchema.safeParseAsync(body.data);

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

	const prCodesResult = lookupPrCodes(
		validationResult.data.codes,
		validationResult.data.onlyFoundCodes
	);
	if (!prCodesResult.ok) {
		logger.error({ ...validationResult.data, err: prCodesResult.error }, 'PR codes lookup failed');
		return Response.json(
			{ message: 'PR codes lookup failed' } satisfies InternalServerErrorResponse,
			{
				status: 500
			}
		);
	}

	return Response.json({
		result: prCodesResult.data
	} satisfies PrCodesApiResponse);
};
