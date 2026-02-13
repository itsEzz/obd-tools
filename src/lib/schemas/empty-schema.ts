import z from 'zod';

export const emptySchema = z.object({});

export type EmptySchema = z.infer<typeof emptySchema>;
