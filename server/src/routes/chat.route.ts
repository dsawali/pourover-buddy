import { Router, type Request, type Response } from 'express';
import { ChatRequestSchema } from '../schemas/chat.schema.js';
import { CHAT_SYSTEM_PROMPT } from '../prompts/chat.prompt.js';
import { streamChat } from '../services/anthropic.service.js';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  const result = ChatRequestSchema.safeParse(req.body);

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
    const stream = await streamChat(CHAT_SYSTEM_PROMPT, result.data.messages);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(JSON.stringify(chunk.delta.text));
      }
    }

    res.end();
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
