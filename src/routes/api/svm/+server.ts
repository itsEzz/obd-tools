import { svmXor } from '$lib/logic/svm';
import { svmApiSchema } from '$lib/schemas/svm';
import { createChildLogger } from '$lib/server/logger';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.svm');

export const POST: RequestHandler = async ({ request }) => {
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const validationResult = svmApiSchema.safeParse(body.data);

	if (!validationResult.success) {
		logger.error('JSON Body validation failed');
		return json(
			{ error: 'JSON Body validation failed', issues: validationResult.error.issues },
			{ status: 400 }
		);
	}

	const svmResult = svmXor(validationResult.data.value);
	if (!svmResult.ok) {
		logger.error(
			{ ...validationResult.data, error: svmResult.error },
			'SVM XOR calculation failed'
		);
		return json({ error: 'SVM XOR calculation failed' }, { status: 500 });
	}

	return json({
		result: svmResult.data
	});
};
