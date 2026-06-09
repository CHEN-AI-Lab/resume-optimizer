/**
 * Validators — placeholders for Zod schemas.
 * Install zod and add schemas when formalizing API input validation.
 *
 * Example usage:
 * import { z } from "zod";
 * export const analyzeSchema = z.object({
 *   text: z.string().min(10, "Resume too short").max(50000),
 * });
 */

// Placeholder for future Zod schemas
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validate resume analysis input
 */
export function validateResumeInput(text: string): ValidationResult {
  if (!text || text.trim().length < 10) {
    return { valid: false, errors: ["Resume text must be at least 10 characters"] };
  }
  if (text.length > 50000) {
    return { valid: false, errors: ["Resume text must be under 50,000 characters"] };
  }
  return { valid: true };
}