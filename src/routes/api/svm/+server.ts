import { svmXor } from '$lib/logic/svm';
import { svmSchema } from '$lib/schemas/svm';
import { createChildLogger } from '$lib/server/logger';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.svm');

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const validationResult = svmSchema.safeParse(body);

	if (!validationResult.success)
		return json(
			{ error: 'Body validation failed', issues: validationResult.error.issues },
			{ status: 400 }
		);

	const svmResult = svmXor(validationResult.data.value);
	if (!svmResult.ok) {
		logger.error(
			{ value: validationResult.data.value, error: svmResult.error },
			'SVM XOR calculation failed'
		);
		return json({ error: 'SVM XOR calculation failed' }, { status: 500 });
	}

	return json({
		result: svmResult.data
	});
};
