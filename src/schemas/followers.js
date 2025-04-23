import { z } from 'zod';

//response model from github
export const githubResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  rank: z.number().int().nullable(), // historical rank or null if not ranked
});

//followers request model
export const followersRequestSchema = z.object({
  userId: z
    .string()
    .min(1, 'User Id is required')
    .max(39, 'User Id must be less than 39 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'User Id must be alphanumeric or hyphens'),
});

//followers response model
export const followersResponseSchema = z.object({
  count: z.number().int(),
  followers: z.array(githubResponseSchema),
});
