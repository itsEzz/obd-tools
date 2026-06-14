import { tc } from '@itsezz/try-catch';
import z from 'zod';

const rateUnitSchema = z.enum([
	'ms',
	'100ms',
	'250ms',
	'500ms',
	's',
	'2s',
	'5s',
	'10s',
	'15s',
	'30s',
	'45s',
	'm',
	'2m',
	'5m',
	'10m',
	'15m',
	'30m',
	'45m',
	'h',
	'2h',
	'6h',
	'12h',
	'd'
]);

const positiveNumberFromString = z.coerce.number().int().positive().min(1, 'Must be at least 1');

const rateSchema = z.union([
	z.tuple([positiveNumberFromString, rateUnitSchema]),
	z.array(z.tuple([positiveNumberFromString, rateUnitSchema]))
]);

const rateFromString = z
	.string()
	.optional()
	.transform((val, ctx) => {
		const result = tc(() => {
			if (val === undefined) return val;
			const parsed = JSON.parse(val);
			return rateSchema.parse(parsed);
		});
		if (!result.ok) {
			ctx.addIssue({
				code: 'custom',
				message: `Invalid rate limiter format. Expected JSON array like [30, "m"] or [[30, "m"], [100, "h"]]`
			});
			return z.NEVER;
		}

		return result.data;
	});

export const serverEnvSchema = z.object({
	RATE_LIMITER_IP: rateFromString.optional().default([30, 'm']),
	RATE_LIMITER_IPUA: rateFromString.optional().default([20, 'm'])
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const clientEnvSchema = z.object({
	PUBLIC_PAYPAL_DONATION_LINK: z.url('Must be a valid URL').optional(),
	PUBLIC_UMAMI_HOST_URL: z.url('Must be a valid URL').optional(),
	PUBLIC_UMAMI_DOMAINS: z.string().optional(),
	PUBLIC_UMAMI_TAG: z.string().optional(),
	PUBLIC_UMAMI_PERFORMANCE: z.enum(['true', 'false']).optional(),
	PUBLIC_UMAMI_EXCLUDE_SEARCH: z.enum(['true', 'false']).optional(),
	PUBLIC_UMAMI_EXCLUDE_HASH: z.enum(['true', 'false']).optional(),
	PUBLIC_UMAMI_DO_NOT_TRACK: z.enum(['true', 'false']).optional(),
	PUBLIC_UMAMI_WEBSITE_ID: z.uuid({ version: 'v4', message: 'Must be a valid UUID v4' }).optional()
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
