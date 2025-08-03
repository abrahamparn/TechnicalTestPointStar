import express from "express";
import testDbController from "./testDb.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createTestDbSchema, updateTestDbSchema } from "./testDb.validator.js";

const router = express.Router();

router.post("/", validate(createTestDbSchema), testDbController.createTestDbData);
router.delete("/:id", testDbController.deleteTestDbData);
router.put("/:id", testDbController.updateTestDbData);
router.get("/", testDbController.getAllTestDbData);
export { router as testDbRouter };
