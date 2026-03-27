import { lookupPrCodes } from '$lib/logic/pr-codes';
import { prCodesApiSchema } from '$lib/schemas/pr-codes';
import { createChildLogger } from '$lib/server/logger';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.prl');

export const POST: RequestHandler = async ({ request }) => {
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const validationResult = prCodesApiSchema.safeParse(body.data);

	if (!validationResult.success) {
		logger.error('JSON Body validation failed');
		return json(
			{ error: 'JSON Body validation failed', issues: validationResult.error.issues },
			{ status: 400 }
		);
	}

	const prCodesResult = lookupPrCodes(
		validationResult.data.codes,
		validationResult.data.onlyFoundCodes
	);
	if (!prCodesResult.ok) {
		logger.error(
			{ ...validationResult.data, error: prCodesResult.error },
			'PR codes lookup failed'
		);
		return json({ error: 'PR codes lookup failed' }, { status: 500 });
	}

	return json({
		result: prCodesResult.data
	});
};
