import { codingCompare } from '$lib/logic/coding-compare';
import { codingCompareSchema } from '$lib/schemas/coding-compare';
import { createChildLogger } from '$lib/server/logger';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.cc');

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const validationResult = codingCompareSchema.safeParse(body);

	if (!validationResult.success)
		return json(
			{ error: 'Body validation failed', issues: validationResult.error.issues },
			{ status: 400 }
		);

	const codingCompareResult = codingCompare(
		validationResult.data.value1,
		validationResult.data.value2
	);
	if (!codingCompareResult.ok) {
		logger.error(
			{ value: validationResult.data.value1, error: codingCompareResult.error },
			'Coding compare failed'
		);
		return json({ error: 'Coding compare failed' }, { status: 500 });
	}

	return json({
		result: codingCompareResult.data
	});
};
