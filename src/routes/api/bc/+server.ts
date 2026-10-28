import { convertOBDElevenBackup } from '#lib/logic/backup-converter.js';
import type { BadRequestResponse, InternalServerErrorResponse } from '#lib/schemas/api.js';
import {
	backupConverterApiSchema,
	type BackupConverterApiResponse
} from '#lib/schemas/backup-converter.js';
import { createChildLogger } from '#lib/server/logger.js';
import { umami } from '#lib/utils/umami.js';
import { tca } from '@itsezz/try-catch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.bc');

export const POST: RequestHandler = async ({ request }) => {
	await umami.track({ url: '/api/bc', title: 'Backup Converter' });
	const formDataResult = await tca(request.formData());

	if (!formDataResult.ok) {
		logger.error('Failed to parse multipart form data');
		return json({ error: 'Invalid multipart form data' } satisfies BadRequestResponse, {
			status: 400
		});
	}

	const validationResult = await backupConverterApiSchema.safeParseAsync(
		Object.fromEntries(formDataResult.data)
	);

	if (!validationResult.success) {
		logger.error('Form data validation failed');
		return json(
			{
				error: 'Form data validation failed',
				issues: validationResult.error.issues
			} satisfies BadRequestResponse,
			{ status: 400 }
		);
	}

	const backupConverterResult = convertOBDElevenBackup(validationResult.data);
	if (!backupConverterResult.ok) {
		logger.error(
			{ ...validationResult.data, err: backupConverterResult.error },
			'Backup converter failed'
		);
		return json({ message: 'Backup converter failed' } satisfies InternalServerErrorResponse, {
			status: 500
		});
	}

	return json({
		result: backupConverterResult.data
	} satisfies BackupConverterApiResponse);
};
