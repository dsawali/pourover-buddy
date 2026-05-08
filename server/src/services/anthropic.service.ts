import Anthropic from '@anthropic-ai/sdk';
// import { BrewDiagnosisSchema } from '../schemas/diagnosis.schema.js';
// import { BrewDiagnosis } from '../types/diagnosis.types.js';
import 'dotenv/config';


console.log(process.env.ANTHROPIC_API_KEY)

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-opus-4-6';

export async function streamBrewGuide(
  systemPrompt: string,
  userPrompt: string
) {

  return client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
}

// export async function getDiagnosis(
//   systemPrompt: string,
//   userPrompt: string
// ): Promise<BrewDiagnosis> {

// }