import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("A valid email is required"),
    password: z.string().min(8, "Password must be atleast 8 characters long"),
    name: z.string().min(2, "Name is required"),
    username: z.string().min(5, "username must be 5 characters minimum"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("A valid email is required"),
    password: z.string().min(8, "Password must be atleast 8 characters long"),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      password: z.string().min(8, "Old password must be at least 8 characters long"),
      newPassword: z.string().min(8, "New password must be at least 8 characters long"),
      reNewPassword: z.string().min(8, "Password confirmation is required"),
    })
    // First, check if the new password is different from the old one
    .refine((data) => data.password !== data.newPassword, {
      message: "New password cannot be the same as the old password.",
      path: ["newPassword"],
    })
    // Second, check if the new password and its confirmation match
    .refine((data) => data.newPassword === data.reNewPassword, {
      message: "Passwords do not match.",
      path: ["reNewPassword"],
    }),
});

export const emailSchema = z.object({
  body: z.object({
    email: z.string().email("A valid email is required"),
  }),
});

export const forgetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string(),
      newPassword: z.string().min(8, "newPassword must be at least 8 characters long"),
      reNewPassword: z.string().min(8, "ReNewPassword must be at least 8 characters long"),
    })
    // Second, check if the new password and its confirmation match
    .refine((data) => data.newPassword === data.reNewPassword, {
      message: "Passwords do not match.",
      path: ["reNewPassword"],
    }),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim() // Remove whitespace from both ends
        .optional()
        .refine((val) => !val || val.length >= 5, {
          message: "Name must be at least 5 characters long",
        }),

      username: z
        .string()
        .trim()
        .optional()
        .refine((val) => !val || val.length >= 5, {
          message: "Username must be at least 5 characters long",
        }),

      phone_number: z
        .string()
        .trim()
        .optional()
        .refine((val) => !val || val.length >= 10, {
          message: "Phone number must be at least 10 characters long",
        }),
    })
    .refine(
      (data) => {
        return Object.values(data).some((value) => value && value.length > 0);
      },
      {
        message:
          "At least one field (name, username, or phone_number) must be provided with a non-empty value.",
      }
    ),
});
