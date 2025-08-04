/**
 *
 * All the necessary data operations for api notes authentication
 * Starting from finding note id, data mutation, to deletion
 */
export function makeNoteRepository({ prisma }) {
  return {
    findById({ note_id }) {
      return prisma.notes.findUnique({ where: { note_id: note_id, is_deleted: false } });
    },
    findByUserId({ user_id }) {
      return prisma.notes.findMany({ where: { user_id: user_id, is_deleted: false } });
    },
    findByIdAndUserId({ note_id, user_id }) {
      return prisma.notes.findUnique({
        where: { note_id: note_id, user_id: user_id, is_deleted: false },
        select: {
          note_id: true,
          title: true,
          content: true,
          tags: true,
          sentiment: true,
          created_at: true,
          updated_at: true,
          user_id: true,
        },
      });
    },
    create({ title, content, user_id }) {
      return prisma.notes.create({
        data: {
          title,
          content,
          user_id,
        },
      });
    },
    edit({ note_id, title, content, user_id }) {
      return prisma.notes.updateMany({
        where: { note_id: note_id, is_deleted: false, user_id: user_id },
        data: {
          title,
          content,
        },
      });
    },

    // We will try not to do checking user_id using the findById because of implementation of atomic operation
    delete({ note_id, user_id }) {
      return prisma.notes.updateMany({
        where: { note_id: note_id, user_id: user_id, is_deleted: false },
        data: {
          is_deleted: true,
        },
      });
    },
  };
}
