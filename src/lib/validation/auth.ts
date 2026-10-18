import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8),
    country: z.string().min(2),
    preferredLanguage: z.string().min(2),
    ageBracket: z.string().min(1),
    intent: z
      .enum(["learner", "instructor", "academy", "organization", "parent"])
      .default("learner"),
    termsAccepted: z.literal("on", {
      error: "You must accept the terms.",
    }),
    privacyAcknowledged: z.literal("on", {
      error: "You must acknowledge the privacy notice.",
    }),
    phone: z.string().optional(),
    interests: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const profileSchema = z.object({
  fullName: z.string().min(2),
  displayName: z.string().min(2).optional().or(z.literal("")),
  headline: z.string().max(120).optional().or(z.literal("")),
  biography: z.string().max(1200).optional().or(z.literal("")),
  country: z.string().min(2),
  county: z.string().optional().or(z.literal("")),
  preferredLanguage: z.string().min(2),
  timeZone: z.string().min(2),
  ageBracket: z.string().min(1),
  publicProfileVisibility: z.enum(["private", "limited", "public"]),
});
