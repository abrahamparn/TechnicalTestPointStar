/**
 * Auth Router
 *
 * Defines all authentication-related API routes:
 * - Registration, Login, Logout
 * - Email verification & session refresh
 * - Password management (change, forget, reset)
 * - Get & update user profile
 *
 * Includes request schema validation and middleware-based auth protection.
 */

import express from "express";
import authController from "./auth.controller.js";
import { authMiddleWare } from "../../../infra/security/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  emailSchema,
  forgetPasswordSchema,
  updateUserSchema,
} from "./auth.validator.js";
import { validate } from "../../middleware/validate.middleware.js";
const router = express.Router();

router.post("/", validate(registerSchema), authController.createUser);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", validate(loginSchema), authController.loginUser);
router.get("/getMe", authMiddleWare, authController.getMe);
router.post("/refresh", authController.refreshToken);
router.post("/logOut", authController.logOut);
router.post(
  "/changePassword",
  authMiddleWare,
  validate(changePasswordSchema),
  authController.changePassword
);
router.post("/forgetPasswordEmail", validate(emailSchema), authController.forgetPasswordEmail);
router.post("/forgetPassword", validate(forgetPasswordSchema), authController.forgetPassword);
router.patch(
  "/updateUserData",
  authMiddleWare,
  validate(updateUserSchema),
  authController.updateUserData
);

export { router as authRouter };
