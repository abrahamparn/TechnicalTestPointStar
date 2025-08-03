import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "../errors/httpErrors.js";

export function makeAuthService({ authServiceRepository, env, mailerService }) {
  return {
    async register({ email, name, username, password, role }) {
      let doesEmailExists = await authServiceRepository.findByEmail({ email });
      if (doesEmailExists) {
        throw new ConflictError("A user with this email already exists.");
      }
      let doesUsernameExists = await authServiceRepository.findByUsername({ username });
      if (doesUsernameExists) {
        throw new ConflictError("A user with this username already exists.");
      }

      const saltRounds = env.BCRYPT_ROUNDS;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const rawToken = crypto.randomBytes(64).toString("hex");

      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

      const tokenExpires = new Date(Date.now() + 3600000); // 1 hour

      const user = await authServiceRepository.create({
        email,
        name,
        username,
        password: hashedPassword,
        role,
        verificationToken: hashedToken,
        verificationTokenExpires: tokenExpires,
      });

      //! CHANGE THIS LATER
      const verificationUrl = `${env.DEVELOPMENT_URL}/auth/verify-email?token=${rawToken}`;

      //! CHANGE THIS LATER
      await mailerService.sendEmail({
        to: email,
        subject: "Verify Your Email Address",
        text: `Please verify your email by clicking this link: ${verificationUrl}`,
        html: `<p>Please verify your email by clicking this link: <a href="${verificationUrl}">Verify Email</a></p>`,
      });

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    async verifyEmail({ token }) {
      if (!token) {
        throw new UnauthorizedError("Wrong token/already used/token already expired");
      }

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      const user = await authServiceRepository.findByVerificationToken({
        hashedToken,
      });

      if (!user) {
        throw new UnauthorizedError("Wrong token/already used/token already expired");
      }

      if (user.is_verified) {
        throw new UnauthorizedError("Wrong token/already used/token already expired");
      }

      const tokenExpires = user.verification_token_expires;
      const atThemoment = new Date();

      if (tokenExpires < atThemoment) {
        throw new UnauthorizedError("Wrong token/already used/token already expired");
      }

      const bumpedVersion = Number(user.version) + 1;

      const isUpdated = await authServiceRepository.verifyUser({
        id: user.user_id,
        version: bumpedVersion,
      });
    },
    async loginUser({ email, password }) {
      // ! Problem with last_login -> Date is wrong, should be current date
      //is user exists?
      const user = await authServiceRepository.findByEmail({ email });

      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }
      if (!user.is_verified) {
        throw new UnauthorizedError("Please verify email first");
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid email or password");
      }

      if (!user.is_verified) {
        throw new UnauthorizedError("Please verify email first");
      }

      //update Last Login and version
      const lastLogin = new Date();
      const refresh_version = user.refresh_version;

      // User is correct, now we create token
      const accessToken = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          role: user.role,
          refresh_version: refresh_version,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_TTL }
      );

      const refreshToken = jwt.sign(
        { userId: user.user_id, username: user.username, refresh_version: refresh_version },
        env.JWT_REFRESH_SECRET,
        {
          expiresIn: env.JWT_REFRESH_TTL,
        }
      );

      return { accessToken, refreshToken };
    },
    async getMe({ id }) {
      const user = await authServiceRepository.findById({ id: id.userId });

      if (!user) {
        throw new NotFoundError("Cannot find user");
      }

      return {
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        version: user.version,
        phoneNumber: user.phone_number || null,
      };
    },
    async refreshToken({ refreshToken }) {
      if (!refreshToken) {
        throw new UnauthorizedError("There is no refresh token");
      }

      let data;
      try {
        data = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      } catch (exception) {
        throw new UnauthorizedError("Please log in again");
      }

      const user = await authServiceRepository.findById({ id: data.userId });
      if (!user) {
        throw new NotFoundError("cannot find user");
      }
      if (user.is_deleted) {
        throw new NotFoundError("user already deleted");
      }

      if (data.refresh_version != user.refresh_version) {
        throw new UnauthorizedError("Please log in again");
      }

      const accessToken = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          role: user.role,
          refresh_version: user.refresh_version,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_TTL }
      );
      return { accessToken };
    },
    async logOut({ refreshToken }) {
      if (!refreshToken) {
        throw new UnauthorizedError("There is no refresh token");
      }

      let data;
      try {
        data = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
        console.log("datadata", data);
      } catch (exception) {
        throw new UnauthorizedError("Please log in again");
      }

      if (!data) {
        throw new NotFoundError("user not found");
      }

      const refresh_version = Number(data.refresh_version) + 1;

      // update refresh token version

      console.log("refresh_version", refresh_version);

      await authServiceRepository.updateRefreshTokenVersion({
        id: data.userId,
        refresh_version,
      });
      return;
    },

    async changePassword({ user, password, newPassword, reNewPassword }) {
      const userData = await authServiceRepository.findById({ id: user.userId });

      if (!userData) {
        throw new NotFoundError("User Not Found");
      }
      const isOldPasswordCorrect = await bcrypt.compare(password, userData.password);

      if (!isOldPasswordCorrect) {
        throw new UnauthorizedError("Incorrect old password.");
      }

      const newHashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

      const version = Number(userData.version) + 1;
      const user_id = userData.user_id;
      const refresh_version = Number(userData.refresh_version) + 1;

      await authServiceRepository.updatePassword({
        id: user_id,
        refresh_version,
        version,
        newPassword: newHashedPassword,
      });
    },
    async forgetPasswordEmail({ email }) {
      const user = await authServiceRepository.findByEmail({ email });

      if (!user) {
        console.log("This email does not exists");
        return;
      }

      const rawToken = crypto.randomBytes(64).toString("hex");

      const hashedForgetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const forgetPasswordTokenExpires = new Date(Date.now() + 3600000); // 1 hour

      const verificationUrl = `${env.DEVELOPMENT_URL}/auth/change-password?token=${rawToken}`;

      const version = Number(user.version) + 1;
      await authServiceRepository.updateResetToken({
        id: user.user_id,
        password_reset_token: hashedForgetPasswordToken,
        password_reset_expires: forgetPasswordTokenExpires,
        version: version,
      });

      //! CHANGE THIS LATER
      await mailerService.sendEmail({
        to: email,
        subject: "Reset your password now",
        text: `please click this link to reset your password: ${verificationUrl}`,
        html: `<p>Please click this link to reset your password: <a href="${verificationUrl}">change password</a></p>`,
      });
    },

    async forgetPassword({ token, newPassword, reNewPassword }) {
      if (!token) {
        throw new UnauthorizedError("Token not found");
      }

      const hashedForgetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

      const user = await authServiceRepository.findByForgetPasswordToken({
        token: hashedForgetPasswordToken,
      });
      if (!user) {
        throw new NotFoundError("User Non Existing");
      }

      const tokenExpires = user.password_reset_expires;
      const atThemoment = new Date();

      if (tokenExpires < atThemoment) {
        throw new UnauthorizedError("Wrong token/already used/token already expired");
      }

      const version = Number(user.version) + 1;
      const refresh_version = Number(user.refresh_version) + 1;
      const id = user.user_id;

      const saltRounds = env.BCRYPT_ROUNDS;

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await authServiceRepository.updateForgetPassword({
        id,
        version,
        refresh_version,
        hashedPassword,
      });
    },
    async updateUserData({ updateData, userId }) {
      const user = await authServiceRepository.findById({ id: userId });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      if (!user.is_verified) {
        throw new UnauthorizedError("User is not verified yet");
      }

      if (updateData.username) {
        const existingUser = await authServiceRepository.findByUsername({
          username: updateData.username,
        });

        if (existingUser) {
          throw new ConflictError("This username is already taken by another user.");
        }
      }

      const dataToUpdate = {};

      for (const key in updateData) {
        if (updateData[key] && updateData[key].length > 0) {
          dataToUpdate[key] = updateData[key];
        }
      }

      const version = Number(user.version) + 1;
      dataToUpdate["version"] = version;

      const updatedUser = await authServiceRepository.updateUserData({
        id: userId,
        data: dataToUpdate,
      });

      return updatedUser;
    },
  };
}
