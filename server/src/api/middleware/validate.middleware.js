import { AppError } from "../../core/errors/appError.js";

// This middleware factory takes a Zod schema
export const validate = (schema) => async (req, res, next) => {
  try {
    // Zod's parseAsync will check the request against the schema
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // If it passes, call the next middleware (usually the controller)
    return next();
  } catch (error) {
    // If it fails, Zod throws an error. We'll re-format it into our custom AppError.
    // This will be caught by our global error handler.
    const message = "Validation Error";
    console.log("error", error);
    const details = error.errors.map((e) => ({ message: e.message, path: e.path }));

    // Create a new AppError with a 400 status and the validation details
    throw new AppError(message, 400, details);
  }
};
