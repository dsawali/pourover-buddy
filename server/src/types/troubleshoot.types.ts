import { type CoffeeProcessing } from './brew.types.js'

export interface TroubleshootRequest {
  brewer: string;
  doseGrams: number;
  waterGrams: number;
  numberOfPours: number;
  grindSize: string;
  waterTempCelsius: number;
  processing: CoffeeProcessing;
  roastLevel: 'light' | 'medium' | 'dark';
  tasteDescription: string;
  goalDescription: string;
}