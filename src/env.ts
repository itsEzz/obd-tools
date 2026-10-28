import { defineEnvVars } from '@sveltejs/kit/env';
import z from 'zod';

export const variables = defineEnvVars({
	RATE_LIMITER_IP: { schema: z.string().optional() },
	RATE_LIMITER_IPUA: { schema: z.string().optional() },
	PUBLIC_DONATION_LINK: { public: true, schema: z.string().optional() },
	PUBLIC_UMAMI_WEBSITE_ID: { public: true, schema: z.string().optional() },
	PUBLIC_UMAMI_SCRIPT_URL: { public: true, schema: z.string().optional() },
	PUBLIC_UMAMI_HOST_URL: { public: true, schema: z.string().optional() },
	PUBLIC_UMAMI_DOMAINS: { public: true, schema: z.string().optional() },
	PUBLIC_UMAMI_TAG: { public: true, schema: z.string().optional() },
	PUBLIC_UMAMI_PERFORMANCE: { public: true, schema: z.enum(['true', 'false']).optional() },
	PUBLIC_UMAMI_EXCLUDE_SEARCH: { public: true, schema: z.enum(['true', 'false']).optional() },
	PUBLIC_UMAMI_EXCLUDE_HASH: { public: true, schema: z.enum(['true', 'false']).optional() },
	PUBLIC_UMAMI_DO_NOT_TRACK: { public: true, schema: z.enum(['true', 'false']).optional() }
});
