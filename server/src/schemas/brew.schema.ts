import { z } from 'zod';

export const CoffeeProcessingSchema = z.enum([
 'washed',
  'natural',
  'honey',
  'anaerobic',
  'anaerobic_washed',
  'anaerobic_natural',
  'wet_hulled',
  'thermal_shock',
  'other',
  'unknown',
]);

const CoffeeVarietySchema = z.enum([
  'bourbon',
  'typica',
  'gesha',
  'sidra',
  'sl28',
  'sl34',
  'catuai',
  'caturra',
  'pacamara',
  'heirloom',
  'liberica',
  'other',
  'unknown'
]);


export const BrewRequestSchema = z.object({
  brewer: z.enum([
    'conical',
    'flat_bottom'
  ]),
  processing: CoffeeProcessingSchema,
  variety: CoffeeVarietySchema,
  elevationMeters: z
    .number()
    .int()
    .min(0, 'Elevation cannot be negative')
    .max(3500, 'Elevation above 3500m is unusually high — check this value')
    .optional(),
  roastLevel: z.enum(['light', 'medium', 'dark']),
});

export type BrewRequest = z.infer<typeof BrewRequestSchema>;