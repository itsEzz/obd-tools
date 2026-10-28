import { clientEnv } from '#lib/env.js';
import { createChildLogger } from '#lib/server/logger.js';
import { tca } from '@itsezz/try-catch';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logger = createChildLogger('api.proxy.stats.js');

export const GET: RequestHandler = async ({ fetch }) => {
	if (!clientEnv.PUBLIC_UMAMI_WEBSITE_ID) return error(404, 'Not configured');

	const scriptResult = await tca<Response, Error>(fetch('https://cloud.umami.is/script.js'));

	if (!scriptResult.ok) {
		logger.error(
			{ err: scriptResult.error },
			'Failed to retrieve umami tracking script from source'
		);
		return new Response(null, { status: 204 });
	}

	const bodyResult = await tca(scriptResult.data.text());

	if (!bodyResult.ok) {
		logger.error({ err: bodyResult.error }, 'Failed to read umami tracking script from request');
		return new Response(null, { status: 204 });
	}

	return new Response(bodyResult.data, {
		headers: {
			'content-type': 'application/javascript; charset=utf-8',
			'cache-control': 'public, max-age=3600, stale-while-revalidate, stale-if-error'
		}
	});
};
