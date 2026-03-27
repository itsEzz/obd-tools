import { hexToBinary } from '$lib/logic/hex-to-binary';
import { hexToBinaryApiSchema } from '$lib/schemas/hex-to-binary';
import { createChildLogger } from '$lib/server/logger';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.htb');

export const POST: RequestHandler = async ({ request }) => {
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const validationResult = await hexToBinaryApiSchema.safeParseAsync(body.data);

	if (!validationResult.success) {
		logger.error('JSON Body validation failed');
		return json(
			{ error: 'JSON Body validation failed', issues: validationResult.error.issues },
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
		return json({ error: 'Hex to binary failed' }, { status: 500 });
	}

	return json({
		result: hexToBinaryResult.data
	});
};
