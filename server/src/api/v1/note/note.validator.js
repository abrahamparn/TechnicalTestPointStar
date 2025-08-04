import { z } from "zod";

/**
 * Note Validation Schemas (Zod)
 *
 * These schemas validate the request body for creating and editing notes.
 * They ensure required fields (`title` and `content`) are present and non-empty.
 * Used in conjunction with the `validate.middleware.js` to enforce input validation.
 */

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  }),
});

export const editNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  }),
});
