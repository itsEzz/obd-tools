import { openApiDocument } from '$lib/openapi';
import { ScalarApiReference } from '@scalar/sveltekit';
import type { RequestHandler } from './$types';
import { m } from '$lib/paraglide/messages';

const render = ScalarApiReference({
	theme: 'alternate',
	sources: [{ content: openApiDocument }],
	pageTitle: m.openapi_title(),
	showDeveloperTools: 'localhost',
	telemetry: false,
	agent: { disabled: true },
	mcp: { disabled: true },
	hideClientButton: true,
	hideDownloadButton: true
});

export const GET: RequestHandler = () => {
	return render();
};
