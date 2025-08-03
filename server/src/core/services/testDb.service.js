import { ConflictError, NotFoundError } from "../errors/httpErrors.js";

export function makeTestDbService({ testDbRepository }) {
  return {
    create(dto) {
      return testDbRepository.create(dto);
    },
    list() {
      return testDbRepository.list();
    },
    async update(id, version, dto) {
      const existingRecord = await testDbRepository.findById(id);
      if (!existingRecord) {
        throw new NotFoundError("TestDB record not found.");
      }

      if (existingRecord.deleted) {
        throw new NotFoundError("TestDB record not found.");
      }

      const { count } = await testDbRepository.update(id, dto);
      if (count === 0) {
        throw new ConflictError(
          "This document has been modified by someone else. Please refresh and try again."
        );
      }
      return testDbRepository.findById(id);
    },
    remove(id) {
      return testDbRepository.softDelete(id);
    },
  };
}
