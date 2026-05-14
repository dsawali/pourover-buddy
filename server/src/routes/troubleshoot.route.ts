import { Router, type Request, type Response } from 'express';
import { TroubleshootRequestSchema } from '../schemas/troubleshoot.schema.js';
import { TROUBLESHOOT_SYSTEM_PROMPT, buildTroubleshootPrompt} from '../prompts/troubleshoot.prompt.js';
import { streamTroubleshoot } from '../services/anthropic.service.js';

export const troubleshootRouter = Router();

troubleshootRouter.post('/', async (req: Request, res: Response) => {
    
    const result = TroubleshootRequestSchema.safeParse(req.body);

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
      const userPrompt = buildTroubleshootPrompt(result.data);
      const stream = await streamTroubleshoot(TROUBLESHOOT_SYSTEM_PROMPT, userPrompt);
  
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
      console.error('Troubleshoot route error:', err);
      res.status(500).json({ error: 'Failed to generate troubleshoot guide' });
    }
});