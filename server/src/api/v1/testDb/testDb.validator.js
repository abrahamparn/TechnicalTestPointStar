import { z } from "zod";

export const createTestDbSchema = z.object({
  body: z.object({
    no: z.number({ required_error: 'Field "no" is required' }).int().positive(),
    dateTime: z.string({ required_error: 'Field "dateTime" is required' }).datetime(), // Validates ISO 8601 date string
    description: z
      .string({ required_error: 'Field "description" is required' })
      .min(3, "Description must be at least 3 characters long"),
  }),
});

// Schema for updating an existing record.
// All fields are optional, but if they exist, they must conform to the type.
export const updateTestDbSchema = z.object({
  body: z.object({
    no: z.number().int().positive().optional(),
    dateTime: z.string().datetime().optional(),
    description: z.string().min(3, "Description must be at least 3 characters long").optional(),
    // The version field is mandatory for updates to prevent race conditions
    version: z.number({ required_error: 'Field "version" is required' }).int(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a positive integer").transform(Number),
  }),
});
