import { AppError } from "../../../core/errors/appError.js";
// This is just a test
// I understand that i mix service and router, should be separated.

export default {
  async createTestDbData(req, res, next) {
    try {
      const testDbService = req.scope.resolve("testDbService");
      const { no, dateTime, description } = req.body;
      const row = await testDbService.create({ no, dateTime, description });
      return res.status(201).json(row);
    } catch (exception) {
      next(exception);
    }
  },
  async getAllTestDbData(req, res, next) {
    try {
      const testDbService = req.scope.resolve("testDbService");
      const rows = await testDbService.list();
      return res.status(201).json(rows);
    } catch (err) {
      next(err);
    }
  },

  async updateTestDbData(req, res, next) {
    try {
      const testDbService = req.scope.resolve("testDbService");

      const id = Number(req.params.id);
      const { no, dateTime, description, version } = req.body;

      if (version === undefined) {
        throw new AppError("Update requests must include the 'version' field.", 400);
      }

      const row = await testDbService.update(id, version, {
        no: Number(no),
        dateTime,
        description,
      });
      return res.status(200).json(row);
    } catch (err) {
      next(err);
    }
  },

  async deleteTestDbData(req, res, next) {
    try {
      const testDbService = req.scope.resolve("testDbService");

      const id = Number(req.params.id);
      const row = await testDbService.remove(id);
      return res.status(200).json(row);
    } catch (err) {
      next(err);
    }
  },
};
