import { svmXor } from '$lib/logic/svm';
import type { BadRequestResponse, InternalServerErrorResponse } from '$lib/schemas/api';
import { svmApiSchema, type SvmApiResponse } from '$lib/schemas/svm';
import { createChildLogger } from '$lib/server/logger';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.svm');

export const POST: RequestHandler = async ({ request }) => {
	const body = await tca(request.json());

	if (!body.ok) {
		logger.error('Failed to parse JSON body');
		return json({ error: 'Invalid JSON body' } satisfies BadRequestResponse, { status: 400 });
	}

	const validationResult = await svmApiSchema.safeParseAsync(body.data);

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

	const svmResult = svmXor(validationResult.data.value);
	if (!svmResult.ok) {
		logger.error(
			{ ...validationResult.data, error: svmResult.error },
			'SVM XOR calculation failed'
		);
		return json({ message: 'SVM XOR calculation failed' } satisfies InternalServerErrorResponse, {
			status: 500
		});
	}

	return json({
		result: svmResult.data
	} satisfies SvmApiResponse);
};
