export interface BrewDiagnosis {
  diagnosis: string;
  likelyCause: string;
  primaryAdjustment: string;
  secondaryAdjustment: string;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
}

