# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Pourover Buddy is an AI-powered pour-over coffee brewing assistant. It has a Node.js/Express backend (`/server`) and a React Native (Expo) mobile frontend (`/client`).

## Commands

**Server** — run from `server/`:

```bash
npm install
npm run dev        # dev server with hot reload (tsx watch)
npm run build      # compile TypeScript to dist/
npm start          # run compiled server
```

**Client** — run from `client/`:

```bash
npm install
npm run start      # Expo dev server (opens QR code for Expo Go)
npm run web        # web dev server (iOS PWA target)
npm run export:web # export static web build to dist/
```

Build targets:
- Android APK: `eas build --platform android --profile preview`
- iOS: deploy the `dist/` from `export:web` as a PWA

There is no test runner configured yet (`server/tests/brew.test.ts` is a placeholder).

## Environment

The server requires `ANTHROPIC_API_KEY` in `server/.env`.

The client reads `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:3000`) for the server base URL. Set this in `client/.env` for production.

## Architecture

The request lifecycle for both endpoints follows the same pattern:

```
POST /api/<endpoint>
  → Zod schema validation (schemas/)
  → Prompt builder (prompts/)
  → anthropic.service.ts  →  Anthropic API (streaming)
  → chunked text/plain response
```

Each streamed chunk is written as `res.write(JSON.stringify(chunk.delta.text))` — individual JSON-stringified strings, not a JSON array.

**Routes**
- `POST /api/brew` — generates a full brew guide from coffee parameters (brewer type, processing, variety, elevation, roast level). Claude recommends dose, water, ratio, grind, and temperature.
- `POST /api/troubleshoot` — diagnoses a specific cup the user already brewed. Accepts the full brew recipe plus taste/goal descriptions and returns targeted adjustments.
- `POST /api/chat` — free-form follow-up conversation. Accepts a `messages` array of `{ role: 'user' | 'assistant', content: string }` representing the full conversation history. The client is responsible for accumulating history (stateless server); the previous `/brew` or `/troubleshoot` response should be included as an `assistant` message to give Claude context.

**Shared types**
`CoffeeProcessingSchema` (Zod) is defined in `brew.schema.ts` and re-imported by `troubleshoot.schema.ts`. `brew.types.ts` defines the manual TypeScript interfaces; `brew.schema.ts` also exports a `BrewRequest` type inferred from Zod — these two `BrewRequest` types are kept in sync manually.

**TypeScript config**
`server/tsconfig.json` uses `"module": "nodenext"`. All imports of local `.ts` files must use `.js` extensions (e.g., `import { foo } from './bar.js'`).

## Client architecture

The client is Expo SDK 54 with expo-router (file-based routing). Screens live in `client/app/`:

```
index.tsx         → Home: "Brew a cup" / "Troubleshoot" cards
brew.tsx          → Brew form (5 fields)
troubleshoot.tsx  → Troubleshoot form (10 fields, single scroll)
result.tsx        → Streams AI response + inline follow-up chat
```

**State passing between screens:** `RequestContext` (`context/RequestContext.tsx`) holds the pending request + mode. A form screen writes to context then calls `router.push('/result')`; the result screen reads from context on mount and initiates the stream.

**Streaming:** All three API calls use `XMLHttpRequest` with `onprogress` (not `fetch`) because React Native's fetch does not support streaming on native. The server sends chunks as concatenated JSON-stringified strings (e.g. `"Hello"" world"`); `services/api.ts` maintains a byte offset and parses complete JSON string tokens as they arrive.

**Chat flow:** After the initial brew/troubleshoot response finishes streaming, `ChatThread` appears. The first `/api/chat` call seeds the history with the full AI response as an `assistant` message; subsequent calls append turns to the same array.

**Theme:** `constants/theme.ts` — clean minimal style with lilac/lavender palette (`primary: #8B7BB5`). All screens use this; do not introduce inline hex values.
