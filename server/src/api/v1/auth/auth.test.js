import request from "supertest";
import express from "express";
import { authRouter } from "./auth.router.js";
import cookieParser from "cookie-parser";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Thisis a mock function that isolates our router and controller so that we can test the http layer only
const mockAuthService = {
  register: jest.fn(),
  verifyEmail: jest.fn(),
  loginUser: jest.fn(),
  getMe: jest.fn(),
  refreshToken: jest.fn(),
  logOut: jest.fn(),
  changePassword: jest.fn(),
  forgetPasswordEmail: jest.fn(),
  forgetPassword: jest.fn(),
  updateUserData: jest.fn(),
};

const mockEnv = {
  NODE_ENV: "test",
  JWT_SECRET: "test-secret",
  JWT_REFRESH_SECRET: "test-refresh-secret",
  JWT_ACCESS_TTL: "15m",
  JWT_REFRESH_TTL: "7d",
};

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  // Simulate the container.js
  req.scope = {
    resolve: (serviceName) => {
      if (serviceName === "authService") return mockAuthService;
      if (serviceName === "env") return mockEnv;
      return null;
    },
  };
  next();
});
app.use("/api/v1/auth", authRouter); // mounting router we are going to test

describe("Auth Router - /api/v1/auth", () => {
  //reset everything before any test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for user registration
  describe("POST /", () => {
    it("will return 201", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        username: "testuser",
      };

      mockAuthService.register.mockResolvedValue(true);

      const response = await request(app).post("/api/v1/auth/").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
    });
  });

  // Test for verify email
  describe("GET /verify-email", () => {
    it("will return 201 when successful", async () => {
      const token = "another-veryfication-token";
      mockAuthService.verifyEmail.mockResolvedValue(true);

      const response = await request(app).get(`/api/v1/auth/verify-email?token=${token}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain("Email Verified");
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith({ token });
    });
  });

  // Test for login
  describe("POST /login", () => {
    it("will return 200 including cookie and access token", async () => {
      const loginCredentials = { email: "test@example.com", password: "password123" };
      const tokens = { accessToken: "justanaccesstoken", refreshToken: "justarefreshtoken" };
      mockAuthService.loginUser.mockResolvedValue(tokens);

      const response = await request(app).post("/api/v1/auth/login").send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.accessToken).toBe(tokens.accessToken);
      // Check if the Set-Cookie header is present
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain("justarefreshtoken");
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginCredentials);
    });
  });

  // Test for refresh
  describe("POST /refresh", () => {
    it("will return 200 and a new access token", async () => {
      const newAccessToken = { success: true, accessToken: "justanotheraccesstoken" };
      mockAuthService.refreshToken.mockResolvedValue(newAccessToken);

      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", ["refreshToken=justarefreshtoken"]);
      console.log("response.body.refresh", response.body);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBe(newAccessToken.accessToken);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith({
        refreshToken: "justarefreshtoken",
      });
    });
  });

  // Test for POST /logOut
  describe("POST /logOut", () => {
    it("should return 200 on successful logout", async () => {
      mockAuthService.logOut.mockResolvedValue(true);

      const response = await request(app)
        .post("/api/v1/auth/logOut")
        .set("Cookie", ["refreshToken=justarefreshtoken"]);

      console.log("response.body", response.body);
      console.log("response.status", response.status);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockAuthService.logOut).toHaveBeenCalledWith({ refreshToken: "justarefreshtoken" });
    });
  });
});
