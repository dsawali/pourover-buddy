import type { BrewRequest, TroubleshootRequest, ChatMessage } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export { BASE_URL };

type StreamCallbacks = {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: Error) => void;
};

// Returns parsed string tokens and the leftover buffer that didn't form a complete token.
// The server writes each chunk as JSON.stringify(text) — individual quoted strings
// concatenated with no separator, e.g. "Hello"" world""!".
function parseAndConsume(raw: string): { chunks: string[]; remaining: string } {
  const results: string[] = [];
  let i = 0;
  let consumed = 0;

  while (i < raw.length) {
    if (raw[i] !== '"') { i++; continue; }
    let j = i + 1;
    while (j < raw.length) {
      if (raw[j] === '\\') { j += 2; continue; }
      if (raw[j] === '"') break;
      j++;
    }
    if (j >= raw.length) break; // incomplete token — leave in buffer
    try {
      results.push(JSON.parse(raw.slice(i, j + 1)) as string);
      consumed = j + 1;
    } catch {
      consumed = j + 1; // skip malformed token
    }
    i = j + 1;
  }

  return { chunks: results, remaining: raw.slice(consumed) };
}

async function runStream(
  path: string,
  body: unknown,
  callbacks: StreamCallbacks,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`);
  }

  let buffer = '';

  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const { chunks, remaining } = parseAndConsume(buffer);
      buffer = remaining;
      for (const chunk of chunks) callbacks.onChunk(chunk);
    }
    buffer += decoder.decode(); // flush remaining decoder state
  } else {
    // Fallback for environments where response.body is unavailable
    buffer = await response.text();
  }

  // Drain any tokens left in the buffer
  const { chunks } = parseAndConsume(buffer);
  for (const chunk of chunks) callbacks.onChunk(chunk);

  callbacks.onDone();
}

function streamRequest(
  path: string,
  body: unknown,
  callbacks: StreamCallbacks,
): () => void {
  const controller = new AbortController();

  runStream(path, body, callbacks, controller.signal).catch((err: unknown) => {
    if (err instanceof Error && err.name === 'AbortError') return;
    callbacks.onError(err instanceof Error ? err : new Error('Request failed'));
  });

  return () => controller.abort();
}

export function streamBrew(body: BrewRequest, cb: StreamCallbacks): () => void {
  return streamRequest('/api/brew', body, cb);
}

export function streamTroubleshoot(body: TroubleshootRequest, cb: StreamCallbacks): () => void {
  return streamRequest('/api/troubleshoot', body, cb);
}

export function streamChat(messages: ChatMessage[], cb: StreamCallbacks): () => void {
  return streamRequest('/api/chat', { messages }, cb);
}
