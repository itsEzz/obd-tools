import { lookupPrCodes } from '$lib/logic/pr-codes';
import type { BadRequestResponse, InternalServerErrorResponse } from '$lib/schemas/api';
import { prCodesApiSchema, type PrCodesApiResponse } from '$lib/schemas/pr-codes';
import { createChildLogger } from '$lib/server/logger';
import { umami } from '$lib/utils/umami';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.prl');

export const POST: RequestHandler = async ({ request }) => {
	await umami.track({ url: '/api/prl', title: 'PR Codes Lookup' });
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' } satisfies BadRequestResponse, { status: 400 });
	}

	const validationResult = await prCodesApiSchema.safeParseAsync(body.data);

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

	const prCodesResult = lookupPrCodes(
		validationResult.data.codes,
		validationResult.data.onlyFoundCodes
	);
	if (!prCodesResult.ok) {
		logger.error({ ...validationResult.data, err: prCodesResult.error }, 'PR codes lookup failed');
		return json({ message: 'PR codes lookup failed' } satisfies InternalServerErrorResponse, {
			status: 500
		});
	}

	return json({
		result: prCodesResult.data
	} satisfies PrCodesApiResponse);
};
