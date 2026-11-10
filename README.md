# Quadra corporate video: Remotion project and storyboards

Picking this up? Start with [HANDOFF.md](HANDOFF.md): current status, what changed in review round 2, open items and Windows gotchas.

## Contents
- `quadra-video/`: Remotion 4 project (React + TypeScript), with footage, voiceover, brand assets and source code.
- `storyboards/`: storyboard pages (open the `.html` files in a browser) and their frame images.

## Run it
1. Install Node.js 20.19+, 22.13+ or 24 (see `engines` in `package.json`).
2. In `quadra-video/`, run `npm install`, then `npm run dev`.
3. Open http://localhost:3000 and choose a composition:
   - **QuadraIntro**: the current 5-minute intro (13 scenes, voice: Hope). Source code is in `src/intro2/Film.tsx`.
   - QuadraIntroV1: the first intro version.
   - QuadraOfficeTV: the 25 fps Office TV cut.
4. To render: `npx remotion render QuadraIntro out/QuadraIntro.mp4 --codec=h264 --crf=18`

## Not included
- `node_modules` (recreated by `npm install`) and rendered videos.
- **Background music** `public/music/reference-instrumental.wav` (and `reference-temp.wav`). This is a copyrighted reference track, so it is not passed on. `MUSIC` in `src/intro2/Film.tsx` now points to `tv/music/score.mp3` (the original score, included); to use a licensed track instead, add it under `public/` and point `MUSIC` at it.
- API keys. The scripts `generate-*.ts` regenerate voiceover and music with ElevenLabs and read the key from a `.env` file you supply (`ENV_FILE=...`).

The sound effects load from remotion.media, so preview and render need an internet connection.
