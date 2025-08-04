import jwt, { decode } from "jsonwebtoken";
import { UnauthorizedError } from "../../core/errors/httpErrors.js";

// Authentication middleware for Express routes.

export async function authMiddleWare(req, res, next) {
  const authHeader = req.headers.authorization;

  // Ensure the request contains an Authorization header with a Bearer token

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided, authorization denied.");
  }

  // Extract the token value from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Resolve environment configuration and secret
    const env = req.scope.resolve("env");
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const authServiceRepository = req.scope.resolve("authServiceRepository");
    const user = await authServiceRepository.findById({ id: decoded.userId });

    if (user.refresh_version != decoded.refresh_version) {
      throw new UnauthorizedError("Token is not valid");
    }

    // Attach authenticated user context to request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      refresh_version: decoded.refresh_version,
    };
    next();
  } catch (exception) {
    // Log exception for debugging (only in dev; avoid logging tokens in prod)
    console.log("exception", exception);
    throw new UnauthorizedError("Token is not valid");
  }
}
