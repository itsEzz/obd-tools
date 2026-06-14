import { clientAppConfig } from '$lib/utils/client-app-config';
import { tca } from '@itsezz/try-catch';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	if (!clientAppConfig.PUBLIC_UMAMI_WEBSITE_ID) return error(404, 'Not configured');

	const res = await fetch('https://cloud.umami.is/script.js');

	if (!res.ok) error(res.status, `Upstream returned ${res.status}`);

	const body = await tca(res.text());

	if (!body.ok) error(500, 'Failed to read script');

	return new Response(body.data, {
		headers: {
			'content-type': 'application/javascript; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};
