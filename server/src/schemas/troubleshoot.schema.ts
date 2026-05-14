import { z } from 'zod';
import { CoffeeProcessingSchema } from './brew.schema.js'

export const TroubleshootRequestSchema = z.object({
  brewer: z.enum(['conical', 'flat_bottom']),
  doseGrams: z.number().int(),
  waterGrams: z.number().int(),
  numberOfPours: z.number().int(),
  grindSize: z.string(),
  waterTempCelsius: z.number(),
  processing: CoffeeProcessingSchema,
  roastLevel: z.enum(['light', 'medium', 'dark']),
  tasteDescription: z.string(),
  goalDescription: z.string(),
});

export type BrewDiagnosis = z.infer<typeof TroubleshootRequestSchema>;