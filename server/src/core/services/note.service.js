import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "../errors/httpErrors.js";

import OpenAI from "openai";

/**
 * Factory function for building the note service.
 * Handles CRUD operations for notes and integrates with OpenAI for summarization.
 */
export function makeNoteService({ noteServiceRepository, env }) {
  return {
    /**
     * Creates a new note for the user.
     */
    async createNote({ title, content, user_id }) {
      const note = await noteServiceRepository.create({
        title,
        content,
        user_id,
      });
      return note;
    },

    /**
     * Edits an existing note if it belongs to the user.
     */
    async editNote({ note_id, title, content, user_id }) {
      if (note_id === undefined) {
        throw new ValidationError("note_id is required");
      }
      if (user_id === undefined) {
        throw new ValidationError("cannot find note");
      }
      if (!Number(note_id)) {
        throw new ValidationError("note is not existing");
      }

      const note = await noteServiceRepository.edit({
        note_id: Number(note_id),
        title,
        content,
        user_id,
      });
      if (note.count === 0) {
        throw new NotFoundError("Note not found or you do not have permission to edit it.");
      }

      return note;
    },

    /**
     * Retrieves a specific note belonging to the user.
     */
    async getOneNote({ note_id, user_id }) {
      if (note_id === undefined) {
        throw new ValidationError("note_id is required");
      }
      if (user_id === undefined) {
        throw new ValidationError("user_id is required");
      }
      if (!Number(note_id)) {
        throw new ValidationError("note_id must be a number");
      }

      const note = await noteServiceRepository.findByIdAndUserId({
        note_id: Number(note_id),
        user_id,
      });
      if (!note) {
        throw new NotFoundError("note not found");
      }
      return note;
    },

    /**
     * Retrieves all notes for the specified user.
     */
    async getAllNote({ user_id }) {
      const notes = await noteServiceRepository.findByUserId({ user_id });
      return notes;
    },

    /**
     * Deletes a note if it belongs to the user.
     */
    async deleteNote({ user_id, note_id }) {
      if (note_id === undefined) {
        throw new ValidationError("note_id is required");
      }
      if (user_id === undefined) {
        throw new ValidationError("user_id is required");
      }
      if (!Number(note_id)) {
        throw new ValidationError("note_id must be a number");
      }

      const note = await noteServiceRepository.delete({ note_id: Number(note_id), user_id });
      if (note.count === 0) {
        throw new NotFoundError("Note not found or you do not have permission to edit it.");
      }
    },

    /**
     * Uses OpenAI API to summarize a user's note.
     */
    async summarizeNote({ user_id, note_id }) {
      const note = await noteServiceRepository.findByIdAndUserId({
        note_id: Number(note_id),
        user_id,
      });

      if (!note) {
        throw new NotFoundError("Note not found");
      }

      try {
        const token = env.MODEL_TOKEN;
        const endpoint = env.AI_ENPOINT;
        const modelName = env.MODEL_NAME;
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        // Prepare a prompt to instruct the model to summarize the note
        const response = await client.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "system",
              content:
                "You are an expert assistant who summarizes text concisely into a single paragraph.",
            },
            {
              role: "user",
              content: `Please summarize the following note:\n\n---\n\n${note.content}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        });

        // Return the generated summary
        return response.choices[0].message.content;
      } catch (error) {
        console.error("AI summarization failed:", error.message);
        return "Could not generate a summary at this time. Please try again later.";
      }
    },
  };
}
