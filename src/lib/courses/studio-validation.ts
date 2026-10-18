import { z } from "zod";
export const studioDetailsSchema = z.object({
  title: z.string().trim().min(3).max(200),
  subtitle: z.string().max(300).default(""),
  description: z.string().trim().min(20).max(5000),
  schoolId: z.uuid(),
  levelId: z.uuid(),
  language: z.string().min(2).max(10),
  audience: z.string().max(5000).default(""),
  prerequisites: z.string().max(5000).default(""),
  coursePriceKes: z.coerce.number().int().min(0).max(1000000),
  classPriceKes: z.coerce.number().int().min(0).max(1000000),
  sellClasses: z.enum(["on"]).optional(),
});
export function parseClassTitles(value: string) {
  const titles = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return z.array(z.string().min(3).max(200)).max(100).parse(titles);
}
export const studioClassSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().max(5000),
  outcomes: z.string().max(10000),
  exercise: z.string().max(10000),
  minutes: z.coerce.number().int().min(0).max(100000),
  priceKes: z.coerce.number().int().min(0).max(1000000),
});
export const studioQuestionSchema = z.object({
  prompt: z.string().trim().min(5).max(2000),
  explanation: z.string().max(5000),
  options: z.array(z.string().trim().min(1).max(1000)).length(4),
  correct: z.coerce.number().int().min(0).max(3),
});
