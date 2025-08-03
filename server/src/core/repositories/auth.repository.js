export function makeAuthRepository({ prisma }) {
  return {
    findByEmail({ email }) {
      return prisma.users.findUnique({ where: { email: email } });
    },
    findByUsername({ username }) {
      return prisma.users.findUnique({ where: { username: username } });
    },
    findById({ id }) {
      return prisma.users.findUnique({ where: { user_id: id } });
    },
    findByVerificationToken({ hashedToken }) {
      return prisma.users.findUnique({ where: { verification_token: hashedToken } });
    },
    findByForgetPasswordToken({ token }) {
      return prisma.users.findUnique({ where: { password_reset_token: token } });
    },
    findByUsernameAndNotId({ idToExclude, username }) {
      return prisma.users.findFirst({
        where: {
          user_id: {
            not: idToExclude,
          },
          username: username,
        },
      });
    },
    create({
      email,
      name,
      username,
      password,
      role = "user",
      verificationToken,
      verificationTokenExpires,
    }) {
      return prisma.users.create({
        data: {
          email,
          name,
          username,
          password,
          role,
          verification_token: verificationToken,
          verification_token_expires: verificationTokenExpires,
        },
      });
    },
    verifyUser({ id, version }) {
      return prisma.users.update({
        where: { user_id: id },
        data: {
          is_verified: true,
          version: version,
          verification_token: null,
          verification_token_expires: null,
        },
      });
    },
    updateLoginAndRefreshVersion({ id, lastLogin, refresh_version }) {
      return prisma.users.update({
        where: { user_id: id },
        data: { refresh_version: refresh_version, last_login: lastLogin },
      });
    },
    updateRefreshTokenVersion({ id, refresh_version }) {
      return prisma.users.update({
        where: { user_id: id },
        data: { refresh_version: refresh_version },
      });
    },
    updatePassword({ id, refresh_version, version, newPassword }) {
      return prisma.users.update({
        where: { user_id: id },
        data: { refresh_version, version, password: newPassword },
      });
    },
    updateResetToken({ id, password_reset_token, password_reset_expires, version }) {
      return prisma.users.update({
        where: { user_id: id },
        data: { password_reset_token, password_reset_expires, version },
      });
    },
    updateForgetPassword({ id, version, refresh_version, hashedPassword }) {
      return prisma.users.update({
        where: { user_id: id },
        data: {
          version,
          refresh_version,
          password: hashedPassword,
          password_reset_token: null,
          password_reset_expires: null,
        },
      });
    },

    updateUserData({ id, data }) {
      return prisma.users.update({
        where: { user_id: id },
        data,
        select: {
          user_id: true,
          email: true,
          name: true,
          username: true,
          role: true,
          version: true,
        },
      });
    },
  };
}
