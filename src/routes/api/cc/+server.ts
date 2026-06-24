import { codingCompare } from '$lib/logic/coding-compare';
import type { BadRequestResponse, InternalServerErrorResponse } from '$lib/schemas/api';
import { codingCompareApiSchema, type CodingCompareApiResponse } from '$lib/schemas/coding-compare';
import { createChildLogger } from '$lib/server/logger';
import { umami } from '$lib/utils/umami';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.cc');

export const POST: RequestHandler = async ({ request }) => {
	await umami.track({ url: '/api/cc', title: 'Coding Compare' });
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' } satisfies BadRequestResponse, { status: 400 });
	}

	const validationResult = await codingCompareApiSchema.safeParseAsync(body.data);

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

	const codingCompareResult = codingCompare(
		validationResult.data.value1,
		validationResult.data.value2,
		validationResult.data.onlyDiff
	);
	if (!codingCompareResult.ok) {
		logger.error(
			{ ...validationResult.data, err: codingCompareResult.error },
			'Coding compare failed'
		);
		return json({ message: 'Coding compare failed' } satisfies InternalServerErrorResponse, {
			status: 500
		});
	}

	return json({
		result: codingCompareResult.data
	} satisfies CodingCompareApiResponse);
};
