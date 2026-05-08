import { z } from 'zod';

export const BrewDiagnosisSchema = z.object({
  diagnosis: z.string(),
  likelyCause: z.string(),
  primaryAdjustment: z.string(),
  secondaryAdjustment: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']),
  explanation: z.string(),
});

export type BrewDiagnosis = z.infer<typeof BrewDiagnosisSchema>;