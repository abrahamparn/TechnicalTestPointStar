/**
 * Everything here is delegated to service for better readability
 */
export default {
  // will register a new user account
  // if successfull will return 201
  async createUser(req, res, next) {
    try {
      const authService = req.scope.resolve("authService");

      await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
      });
    } catch (exception) {
      next(exception);
    }
  },

  // verifies user's email via token from query 'token'
  //will return 201 if successful
  async verifyEmail(req, res, next) {
    try {
      const authService = req.scope.resolve("authService");
      const env = req.scope.resolve("env");
      const query = req.query;
      await authService.verifyEmail(query);

      res.status(201).json({
        success: true,
        message: "Email Verified, You can login now.",
      });
    } catch (exception) {
      next(exception);
    }
  },

  //receives email and password
  // if successfull, return access token and httpOnly refresh token
  async loginUser(req, res, next) {
    try {
      const authService = req.scope.resolve("authService");
      const env = req.scope.resolve("env");

      const { email, password } = req.body;

      const { accessToken, refreshToken } = await authService.loginUser({ email, password });
      //Store in secure httpOnly
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days // check .env
        secure: env.NODE_ENV === "production",
      });
      res.json({ success: true, accessToken });
    } catch (exception) {
      next(exception);
    }
  },

  // will getuser details based on user id from token
  async getMe(req, res, next) {
    try {
      const authService = req.scope.resolve("authService");
      const id = req.user;
      const iAm = await authService.getMe({ id: id });

      res.json({
        success: true,
        user: iAm,
      });
    } catch (exception) {
      next(exception);
    }
  },

  // will return a new access token
  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      const authService = req.scope.resolve("authService");
      const { accessToken } = await authService.refreshToken({ refreshToken });

      res.json({ success: true, accessToken: accessToken });
    } catch (exception) {
      next(exception);
    }
  },

  // will invalidate refreshtoken by increasing the refresh_token_version
  async logOut(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      const authService = req.scope.resolve("authService");
      await authService.logOut({ refreshToken });
      res.json({ success: true });
    } catch (exception) {
      next(exception);
    }
  },

  // able to change password based on newly inputted pasword and ofcourse the  token
  async changePassword(req, res, next) {
    try {
      const user = req.user;
      const password = req.body.password;
      const newPassword = req.body.newPassword;
      const reNewPassword = req.body.reNewPassword;
      const authService = req.scope.resolve("authService");
      await authService.changePassword({ user, password, newPassword, reNewPassword });
      res.json({ success: true });
    } catch (exception) {
      next(exception);
    }
  },

  // Sends a password reset email if the email is registered.
  async forgetPasswordEmail(req, res, next) {
    try {
      const email = req.body.email;
      const authService = req.scope.resolve("authService");
      await authService.forgetPasswordEmail({ email });

      res.json({
        success: true,
        message: "If your email is registered, we will send a link to it",
      });
    } catch (exception) {
      next(exception);
    }
  },
  //Resets password using a token and new credentials.
  async forgetPassword(req, res, next) {
    try {
      const { token, newPassword, reNewPassword } = req.body;

      const authService = req.scope.resolve("authService");
      await authService.forgetPassword({ token, newPassword, reNewPassword });

      res.json({
        success: true,
      });
    } catch (exception) {
      next(exception);
    }
  },
  //Updates user data based on user ID extracted from the token.
  async updateUserData(req, res, next) {
    try {
      const authService = req.scope.resolve("authService");
      const updateData = req.body;
      const userId = req.user.userId;
      const user = await authService.updateUserData({ updateData, userId });
      res.json({
        success: true,
        user: user,
      });
    } catch (exception) {
      next(exception);
    }
  },
};
