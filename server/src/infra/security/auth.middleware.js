import jwt, { decode } from "jsonwebtoken";
import { UnauthorizedError } from "../../core/errors/httpErrors.js";

export async function authMiddleWare(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided, authorization denied.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const env = req.scope.resolve("env");
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const authServiceRepository = req.scope.resolve("authServiceRepository");
    const user = await authServiceRepository.findById({ id: decoded.userId });

    if (user.refresh_version != decoded.refresh_version) {
      throw new UnauthorizedError("Token is not valid");
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      refresh_version: decoded.refresh_version,
    };
    next();
  } catch (exception) {
    console.log("exception", exception);
    throw new UnauthorizedError("Token is not valid");
  }
}
