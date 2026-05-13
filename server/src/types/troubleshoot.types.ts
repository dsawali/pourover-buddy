import { type CoffeeProcessing } from './brew.types.js'


export interface TroubleshootRequest {
  tasteDescription: string;
  goalDescription: string;
  brewer: string;
  doseGrams: number;
  waterGrams: number;
  numberOfPours: number;
  grindSize: string;
  waterTempCelsius: number;
  processing: CoffeeProcessing;
  roastLevel: 'light' | 'medium' | 'dark';
}