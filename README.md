# AgenzIQ Content Studio

A premium, dark-mode Next.js app that works like an AI content agent for social media planning and static post-image generation.

## Features

- Guided input form for brand strategy
- AI strategist generation of:
  - title
  - hook
  - main caption
  - CTA
  - image concept
  - image prompt
  - reasoning blocks (audience, platform style, marketing goal, post angle)
- Static post visual generation with OpenAI image generation
- Save posts + images to a local content library
- Favorite toggle for saved posts
- Mobile responsive UI
- Secure server-side routes (API key is never exposed to the browser)

## Tech stack

- Next.js (App Router)
- TypeScript
- OpenAI API (`responses` + `images.generate`)
- Local JSON storage for MVP (`data/library.json`)

## 1) Install

```bash
npm install
```

## 2) Configure environment variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Then update:

```env
OPENAI_API_KEY=your_real_key_here
```

## 3) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4) Build for production

```bash
npm run build
npm run start
```

## Project structure

- `app/page.tsx`: main content studio UI
- `app/library/page.tsx`: saved content + favorites
- `app/api/generate-content/route.ts`: server route for strategist text generation via OpenAI Responses API
- `app/api/generate-image/route.ts`: server route for image generation
- `app/api/content-library/route.ts`: save/list/favorite API
- `lib/openai.ts`: OpenAI client setup
- `lib/storage.ts`: local JSON storage helpers

## Notes

- Important logic blocks are commented in API and storage files to stay beginner-friendly.
- For MVP simplicity, saved content is stored in `data/library.json`.
