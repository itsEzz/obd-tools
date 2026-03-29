import z from 'zod';
import type {
	$ZodIssue,
	$ZodIssueBase,
	$ZodIssueCustom,
	$ZodIssueInvalidElement,
	$ZodIssueInvalidKey,
	$ZodIssueInvalidStringFormat,
	$ZodIssueInvalidType,
	$ZodIssueInvalidUnion,
	$ZodIssueInvalidValue,
	$ZodIssueNotMultipleOf,
	$ZodIssueTooBig,
	$ZodIssueTooSmall,
	$ZodIssueUnrecognizedKeys
} from 'zod/v4/core';

const zodBaseIssueSchema = z.object({
	code: z.string().optional(),
	input: z.unknown().optional(),
	path: z.array(z.union([z.string(), z.number()])),
	message: z.string()
}) satisfies z.ZodType<$ZodIssueBase>;

const zodIssueInvalidTypeSchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_type'),
	expected: z.string(),
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueInvalidType>;

const zodIssueTooBigSchema = zodBaseIssueSchema.extend({
	code: z.literal('too_big'),
	origin: z.string(),
	maximum: z.union([z.number(), z.bigint()]),
	inclusive: z.boolean().optional(),
	exact: z.boolean().optional(),
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueTooBig>;

const zodIssueTooSmallSchema = zodBaseIssueSchema.extend({
	code: z.literal('too_small'),
	origin: z.string(),
	minimum: z.union([z.number(), z.bigint()]),
	inclusive: z.boolean().optional(),
	exact: z.boolean().optional(),
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueTooSmall>;

const zodIssueInvalidStringFormatSchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_format'),
	format: z.string(),
	pattern: z.string().optional(),
	input: z.string().optional()
}) satisfies z.ZodType<$ZodIssueInvalidStringFormat>;

const zodIssueNotMultipleOfSchema = zodBaseIssueSchema.extend({
	code: z.literal('not_multiple_of'),
	divisor: z.number(),
	input: z.union([z.number(), z.bigint()]).optional()
}) satisfies z.ZodType<$ZodIssueNotMultipleOf>;

const zodIssueUnrecognizedKeysSchema = zodBaseIssueSchema.extend({
	code: z.literal('unrecognized_keys'),
	keys: z.array(z.string()),
	input: z.record(z.string(), z.unknown()).optional()
}) satisfies z.ZodType<$ZodIssueUnrecognizedKeys>;

const zodIssueInvalidUnionNoMatchSchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_union'),
	get errors() {
		return z.array(z.array(zodIssueSchema));
	},
	input: z.unknown().optional(),
	discriminator: z.string().optional(),
	inclusive: z.literal(true).optional()
});

const zodIssueInvalidUnionMultipleMatchSchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_union'),
	errors: z.tuple([]),
	input: z.unknown().optional(),
	discriminator: z.string().optional(),
	inclusive: z.literal(false)
});

const zodIssueInvalidUnionSchema = z.union([
	zodIssueInvalidUnionNoMatchSchema,
	zodIssueInvalidUnionMultipleMatchSchema
]) satisfies z.ZodType<$ZodIssueInvalidUnion>;

const zodIssueInvalidKeySchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_key'),
	origin: z.union([z.literal('map'), z.literal('record')]),
	get issues() {
		return z.array(zodIssueSchema);
	},
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueInvalidKey>;

const zodIssueInvalidElementSchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_element'),
	origin: z.union([z.literal('map'), z.literal('set')]),
	key: z.unknown(),
	get issues() {
		return z.array(zodIssueSchema);
	},
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueInvalidElement>;

const zodIssueInvalidValueSchema = zodBaseIssueSchema.extend({
	code: z.literal('invalid_value'),
	values: z.array(
		z.union([z.string(), z.number(), z.bigint(), z.boolean(), z.null(), z.undefined()])
	),
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueInvalidValue>;

const zodIssueCustomSchema = zodBaseIssueSchema.extend({
	code: z.literal('custom'),
	params: z.record(z.string(), z.any()).optional(),
	input: z.unknown().optional()
}) satisfies z.ZodType<$ZodIssueCustom>;

const zodIssueSchema: z.ZodType<$ZodIssue> = z
	.lazy(
		() =>
			z.union([
				zodIssueInvalidTypeSchema.meta({ title: 'ZodIssueInvalidType' }),
				zodIssueTooBigSchema.meta({ title: 'ZodIssueTooBig' }),
				zodIssueTooSmallSchema.meta({ title: 'ZodIssueTooSmall' }),
				zodIssueInvalidStringFormatSchema.meta({ title: 'ZodIssueInvalidStringFormat' }),
				zodIssueNotMultipleOfSchema.meta({ title: 'ZodIssueNotMultipleOf' }),
				zodIssueUnrecognizedKeysSchema.meta({ title: 'ZodIssueUnrecognizedKeys' }),
				zodIssueInvalidUnionSchema.meta({ title: 'ZodIssueInvalidUnion' }),
				zodIssueInvalidKeySchema.meta({ title: 'ZodIssueInvalidKey' }),
				zodIssueInvalidElementSchema.meta({ title: 'ZodIssueInvalidElement' }),
				zodIssueInvalidValueSchema.meta({ title: 'ZodIssueInvalidValue' }),
				zodIssueCustomSchema.meta({ title: 'ZodIssueCustom' })
			]) satisfies z.ZodType<$ZodIssue>
	)
	.meta({ title: 'ZodIssue' });

export const badRequestResponseSchema = z.object({
	error: z.string(),
	issues: z.array(zodIssueSchema).optional()
});

export type BadRequestResponse = z.infer<typeof badRequestResponseSchema>;

export const tooManyRequestsResponseSchema = z.string();

export type TooManyRequestsResponse = z.infer<typeof tooManyRequestsResponseSchema>;

export const internalServerErrorResponseSchema = z.object({
	message: z.string()
});

export type InternalServerErrorResponse = z.infer<typeof internalServerErrorResponseSchema>;
