export function makeTestDbRepository({ prisma }) {
  return {
    create({ no, dateTime, description }) {
      return prisma.test_database_crud.create({
        data: {
          no: Number(no),
          dateTime: new Date(dateTime),
          description,
        },
      });
    },
    list() {
      return prisma.test_database_crud.findMany({
        where: { deleted: false },
        orderBy: { id: "asc" },
      });
    },
    /**
     * Updates a record using optimistic locking.
     * @param {number} id The ID of the record.
     * @param {number} version The version number of the record being updated.
     * @param {object} dto The data to update.
     * @returns {Promise<{count: number}>} The number of records updated (0 or 1).
     */
    update(id, version, { no, dateTime, description }) {
      return prisma.test_database_crud.updateMany({
        where: { id, version: version },
        data: { no: Numeber(no), dateTime: new Date(), description, version: { increment: 1 } },
      });
    },
    softDelete(id) {
      return prisma.test_database_crud.update({
        where: { id },
        data: { deleted: true, deleted_at: new Date() }, //fail, need to be fixed more
      });
    },
    findById(id) {
      return prisma.test_database_crud.findUnique({ where: { id } });
    },
  };
}
