import { svmXor } from '$lib/logic/svm';
import { svmSchema } from '$lib/schemas/svm-schema';
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

	const svmResult = svmXor(validationResult.data.key);
	if (!svmResult.ok) {
		logger.error(
			{ key: validationResult.data.key, error: svmResult.error },
			'SVM XOR calculation failed'
		);
		return json({ error: 'SVM XOR calculation failed' }, { status: 500 });
	}

	return json({
		result: svmResult.data
	});
};
