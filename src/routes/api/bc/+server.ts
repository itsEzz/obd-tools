import { convertOBDElevenBackup } from '$lib/logic/backup-converter';
import { backupConverterApiSchema } from '$lib/schemas/backup-converter';
import { createChildLogger } from '$lib/server/logger';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.bc');

export const POST: RequestHandler = async ({ request }) => {
	const formDataResult = await tca(request.formData());

	if (!formDataResult.ok) {
		logger.error('Failed to parse multipart form data');
		return json({ error: 'Invalid multipart form data' }, { status: 400 });
	}

	const validationResult = await backupConverterApiSchema.safeParseAsync(
		Object.fromEntries(formDataResult.data)
	);

	if (!validationResult.success) {
		logger.error('Form data validation failed');
		return json(
			{ error: 'Form data validation failed', issues: validationResult.error.issues },
			{ status: 400 }
		);
	}

	const backupConverterResult = convertOBDElevenBackup(validationResult.data);
	if (!backupConverterResult.ok) {
		logger.error(
			{ ...validationResult.data, error: backupConverterResult.error },
			'Backup converter failed'
		);
		return json({ error: 'Backup converter failed' }, { status: 500 });
	}

	return json({
		result: backupConverterResult.data
	});
};
