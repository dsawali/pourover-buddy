import { Router, type Request, type Response } from 'express';
import { BrewRequestSchema } from '../schemas/brew.schema.js';
import { BREW_SYSTEM_PROMPT, buildBrewPrompt } from '../prompts/brew.prompt.js';
import { streamBrewGuide } from '../services/anthropic.service.js';

export const brewRouter = Router();

brewRouter.post('/', async (req: Request, res: Response) => {


  const result = BrewRequestSchema.safeParse(req.body);


  if (!result.success) {
    res.status(400).json({
      error: 'Invalid request',
      issues: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const userPrompt = buildBrewPrompt(result.data);
    const stream = await streamBrewGuide(BREW_SYSTEM_PROMPT, userPrompt);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const textContent = chunk.delta.text;
        res.write(JSON.stringify(textContent));
      }
    }





    res.end();

  } catch (err) {
    console.error('Brew route error:', err);
    res.status(500).json({ error: 'Failed to generate brew guide' });
  }
});