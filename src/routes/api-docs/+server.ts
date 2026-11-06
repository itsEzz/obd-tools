import { openApiDocument } from '#lib/openapi.js';
import { m } from '#lib/paraglide/messages.js';
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
	return render();
};
