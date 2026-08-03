import { z } from "zod";

export const checkoutSchema = z.object({
  courseId: z.string().uuid(),
  productId: z.string().uuid(),
  priceId: z.string().uuid(),
  couponCode: z.string().optional(),
});

export const paymentSchema = z.object({
  orderId: z.string().uuid(),
  phone: z.string().min(9),
  termsAccepted: z.literal("on"),
});

export const progressSchema = z.object({
  enrollmentId: z.string().uuid(),
  lessonId: z.string().uuid(),
  progressPercentage: z.coerce.number().min(0).max(100),
  positionSeconds: z.coerce.number().int().min(0).optional(),
});

export const quizAttemptSchema = z.object({
  enrollmentId: z.string().uuid(),
  quizId: z.string().uuid(),
});

export const assignmentSubmissionSchema = z.object({
  enrollmentId: z.string().uuid(),
  assignmentId: z.string().uuid(),
  responseText: z.string().min(10),
});

export const refundRequestSchema = z.object({
  orderId: z.string().uuid(),
  paymentAttemptId: z.string().uuid().optional().or(z.literal("")),
  courseId: z.string().uuid().optional().or(z.literal("")),
  reason: z.string().min(3),
  explanation: z.string().min(10),
  requestedAmountMinor: z.coerce.number().int().min(0).optional(),
  requestedResolution: z.string().optional(),
});
