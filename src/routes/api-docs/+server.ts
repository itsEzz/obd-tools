import { openApiDocument } from '$lib/openapi';
import { m } from '$lib/paraglide/messages';
import { umami } from '$lib/utils/umami';
import { ScalarApiReference } from '@scalar/sveltekit';
import type { RequestHandler } from './$types';

const render = ScalarApiReference({
	theme: 'alternate',
	sources: [{ content: openApiDocument }],
	pageTitle: m.openapi_title(),
	showDeveloperTools: 'localhost',
	telemetry: false,
	agent: { disabled: true },
	mcp: { disabled: true },
	hideClientButton: true,
	documentDownloadType: 'none'
});

export const GET: RequestHandler = async () => {
	await umami.track({ url: '/api-docs', title: 'API Docs' });
	return render();
};
