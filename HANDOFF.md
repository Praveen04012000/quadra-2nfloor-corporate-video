# Handoff: Quadra corporate video (QuadraIntro)

| | |
|---|---|
| Company | Quadrasystems.net India Private Limited |
| Author | Praveen Kumar R |
| Handoff date | 10 November 2026 |
| Last full render | 27 October 2026, `QuadraIntro-v2.mp4` (5:00, 1920×1080, 30 fps, H.264 + AAC) |

## Where things stand

QuadraIntro is a 5-minute, 13-scene corporate film built in Remotion 4 (React + TypeScript). Review round 2 is implemented and rendered. The rendered MP4s are **not** in this repository (`out/` is ignored); ask Praveen for `QuadraIntro-v2.mp4` via OneDrive or Teams.

All eight round-2 review points are in. Seven were checked frame by frame; the pronunciation fix (point 2) still needs a listen.

| # | Review point | What was done | Where |
|---|---|---|---|
| 1 | QR code URL | QR now encodes `https://www.quadrasystems.net/` | `src/tv/graphics.tsx` (`QrCode`) |
| 2 | "Quadra AIR" pronunciation | Scene 9 voiceover regenerated so it is read as "Quadra Air"; on-screen text still says "Quadra AIR" | `src/tv/script.ts` (scene 9 `say`), `public/tv/vo/s09.*` |
| 3 | Intro and outro | Higgsfield light-trail plate over the opening; outro logo build and end card sit on one continuous Higgsfield dawn-sky plate (the white flash before the logo was replaced by a crossfade) | `src/intro2/enhance.tsx` (`Trails`, `SkyPlate`), `public/hf/` |
| 4 | AWS and Google logos (~0:23) | Official logos on the partner cards next to Microsoft | `src/intro/flows.tsx` (`Partners`), `public/brand/aws.svg`, `google-cloud.svg` |
| 5 | Intellient (~0:54) and IntelliLink (~1:00) | Full-screen UI footage, black gradient at the bottom, full white logo and chips lower left (replaces the blurred background and device frame) | `src/intro2/enhance.tsx` (`ProductHero`), `public/brand/*-full-white.svg` |
| 6 | Office moment (~2:17) | "Five leaders. / One defence. / One accountability." over live office footage with the five vendor names, replacing the plain navy card | `src/intro2/enhance.tsx` (`Impact`) |
| 7 | Certifications (~3:57–4:03) | Award shelf slightly blurred; ISO/IEC 42001 lands as the hero, ISO 9001 and ISO 27001 rise beneath it | `src/intro2/enhance.tsx` (`CertStack`), `public/brand/tuv-iso*.png` |
| 8 | Celebratory, shuttle-inspired atmosphere | Rising starfield and soft launch-trail glow on every navy and white title card; light-trail bursts at scene changes, the counters, the cheering team and the logo lock | `src/cine/kit.tsx` (`Starfield` inside `BrandGround`), `TRAILS` in `src/intro2/Film.tsx` |

## Open items

1. **Listen to scene 9 (~3:10)** and confirm "Quadra Air" is spoken as a word, not spelt out. Not yet checked by ear.
2. **Stakeholder sign-off** on the eight points above against `QuadraIntro-v2.mp4`.
3. **Music.** The film uses the included original score (`public/tv/music/score.mp3`). The earlier reference instrumental is copyrighted and was never included. Decide whether to keep the score or license a track.
4. **Partner logo approval.** The AWS and Google Cloud logos were taken from Wikimedia Commons. Check them against each partner's logo-usage guidelines, or swap in the versions from the partner portals (same file names in `public/brand/`).
5. **Remotion licence.** Remotion's terms require a company licence for some organisations. Confirm Quadra's position before external release.
6. **Taste call:** the light trails over the final logo are at 50% opacity. If they feel busy, lower `peak` on the last `TRAILS` entry in `src/intro2/Film.tsx`.

## Run it

```bash
cd quadra-video
npm install
npm run dev
```

Open http://localhost:3000 and choose **QuadraIntro** (source: `src/intro2/Film.tsx`). To render:

```bash
npx remotion render QuadraIntro out/QuadraIntro.mp4 --codec=h264 --crf=18 --port=3123
```

A full render took about 30 minutes on a laptop. The first render downloads Chrome Headless Shell (about 120 MB), and the sound effects stream from remotion.media, so both need an internet connection.

## Windows gotchas (all hit during this project)

- **Keep the project on a short path**, for example `D:\Quadra-Corporate-Video`. Under a long path (over 260 characters) the render fails with `chrome-headless-shell.exe ENOENT` or `read ENOTCONN`, because Windows cannot start the bundled browser and helper tools.
- **Port clash with the Studio.** If `npm run dev` is running, a render on the default port loads the Studio page and fails with "window.getStaticCompositions is undefined". Pass `--port=3123` (any free port).
- **Generated clips in HEVC.** Remotion's frame extractor fails on HEVC ("No frame found at position…"). Higgsfield delivered HEVC, so the clips in `public/hf/` were converted. Convert any new generated clip the same way with the bundled ffmpeg:

  ```bash
  node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe -i in.mp4 -r 30 -c:v libx264 -crf 16 -pix_fmt yuv420p -g 30 -bf 0 -an -movflags +faststart out.mp4
  ```

## How the film is built

Every graphic lands on a spoken word. `cue(scene, phrase)` in `src/tv/vo.ts` reads ElevenLabs character timings from `public/tv/vo/sNN.json` and returns the second that phrase is spoken. **If you change voiceover text, every cue phrase used in `src/intro2/Film.tsx` and `src/tv/TvFilm.tsx` must still appear in the new text**, otherwise the project throws on load and no composition opens.

| Path | What it holds |
|---|---|
| `src/intro2/Film.tsx` | The QuadraIntro timeline: footage plates, text and card windows, sound effects, trails, music ducking |
| `src/intro2/footage.json` | Which footage clip plays when |
| `src/intro2/enhance.tsx` | Round-2 components: `ProductHero`, `Impact`, `CertStack`, `Trails`, `SkyPlate` |
| `src/intro/flows.tsx`, `src/intro/fx.tsx` | Shared cards, flows, chips, wipes and transitions |
| `src/cine/kit.tsx` | Brand tokens (navy `#0a1d3b`, blue `#1f6feb`, Raleway), `BrandGround`, `Starfield`, `WordReveal` |
| `src/tv/script.ts` | Voiceover per scene: `vo` is the display script, `say` is the phonetic version sent to ElevenLabs |
| `public/tv/vo/` | Voiceover MP3s and timing JSON (voice: Hope) |
| `public/brand/` | Logos and certification badges |
| `public/hf/` | Higgsfield plates (`trails.mp4`, `sky.mp4`) |
| `storyboards/` | Storyboard pages; open the `.html` files in a browser |

### Regenerating a voiceover scene

Put your own ElevenLabs key in `quadra-video/.env` as `ELEVENLABS_API_KEY=...` (the file is git-ignored; never commit it), edit the scene's `say` text in `src/tv/script.ts`, then:

```bash
ENV_FILE=.env node --strip-types generate-tv-voiceover.ts 9
```

Pass the scene numbers to regenerate only those. The script reports whether the new read fits the scene's slot. Then update any cue phrases that changed.

## Asset sources

| Asset | Source |
|---|---|
| ISO 9001, ISO 27001, ISO/IEC 42001 badges | Supplied by Praveen (TÜV SÜD marks) |
| Intellient and IntelliLink full logos | Quadra's own logo files from other internal Remotion projects; white-wordmark versions made for dark backgrounds |
| AWS and Google Cloud logos | Wikimedia Commons (see open item 4) |
| `public/hf/trails.mp4` | Higgsfield, Seedance 2.5, 8 s, 1080p: abstract launch-style light trails on black, screen-blended over footage |
| `public/hf/sky.mp4` | Higgsfield, Seedance 2.5, 10 s, 1080p: pre-dawn horizon with a rising launch trail, no people, buildings or text |
| Footage, music score, voiceover | Supplied with the original project |
