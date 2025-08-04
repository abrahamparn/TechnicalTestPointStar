import express from "express";
import noteController from "./note.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authMiddleWare } from "../../../infra/security/auth.middleware.js";
import { createNoteSchema, editNoteSchema } from "./note.validator.js";

/**
 * Note Router
 *
 * Defines all routes related to note operations for authenticated users:
 * - CRUD operations: Create, Read (one/all), Update, Delete
 * - Note summarization
 *
 * All routes are protected by auth middleware and validated with Zod schemas.
 */

const router = express.Router();

router.get("/:id", authMiddleWare, noteController.getOneNote);
router.get("/", authMiddleWare, noteController.getAllNotes);
router.post("/", authMiddleWare, validate(createNoteSchema), noteController.createNote);
router.patch("/:id", authMiddleWare, validate(editNoteSchema), noteController.editNote);
router.delete("/:id", authMiddleWare, noteController.deleteNote);
router.get("/:id/summarize", authMiddleWare, noteController.summarizeNote);

export { router as noteRouter };
