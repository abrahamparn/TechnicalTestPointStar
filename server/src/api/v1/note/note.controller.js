/**
 * Notes Controller
 *
 * Handles all CRUD operations and summarization logic for user notes:
 * - Create, edit, fetch, and delete notes
 * - Summarize note content
 *
 * All methods assume user authentication has been performed,
 * and `req.user.userId` is available via middleware.
 */
export default {
  async createNote(req, res, next) {
    try {
      console.log("req.user", req.user);
      const noteService = req.scope.resolve("noteService");
      const { title, content } = req.body;
      const user_id = req.user.userId;
      const note = await noteService.createNote({ title, content, user_id });

      res.status(201).json({
        success: true,
        note: note,
      });
    } catch (exception) {
      next(exception);
    }
  },
  async editNote(req, res, next) {
    try {
      const noteService = req.scope.resolve("noteService");
      const { title, content } = req.body;
      const user_id = req.user.userId;
      const note_id = req.params.id;
      await noteService.editNote({ note_id, title, content, user_id });
      res.status(200).json({
        success: true,
        message: "note udpated successfully",
      });
    } catch (exception) {
      next(exception);
    }
  },
  async getOneNote(req, res, next) {
    try {
      const noteService = req.scope.resolve("noteService");
      const note_id = req.params.id;
      const user_id = req.user.userId;
      const note = await noteService.getOneNote({ note_id, user_id });
      res.status(200).json({
        success: true,
        note: note,
      });
    } catch (exception) {
      next(exception);
    }
  },
  async getAllNotes(req, res, next) {
    try {
      const noteservice = req.scope.resolve("noteService");
      const user_id = req.user.userId;
      const notes = await noteservice.getAllNote({ user_id });
      res.status(200).json({
        success: true,
        notes: notes,
      });
    } catch (exception) {
      next(exception);
    }
  },

  async deleteNote(req, res, next) {
    try {
      const noteservice = req.scope.resolve("noteService");
      const user_id = req.user.userId;
      const note_id = req.params.id;
      await noteservice.deleteNote({ user_id, note_id });
      res.status(200).json({
        success: true,
        message: "deleted successfully.",
      });
    } catch (exception) {
      next(exception);
    }
  },

  async summarizeNote(req, res, next) {
    try {
      const noteservice = req.scope.resolve("noteService");
      const user_id = req.user.userId;
      const note_id = req.params.id;
      const summary = await noteservice.summarizeNote({ user_id, note_id });
      res.status(200).json({
        success: true,
        summary: summary,
      });
    } catch (exception) {
      next(exception);
    }
  },
};
