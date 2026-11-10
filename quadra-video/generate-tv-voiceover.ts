// Generates the Office TV voiceover with ElevenLabs: one MP3 per scene plus character timings, into public/tv/vo/.
// Voice: Hope (upbeat and clear), chosen over the pack's Indian English suggestion. Text comes from src/tv/script.ts (the `say` form where pronunciation needs help).
// Usage:
//   ENV_FILE=<.env with ELEVENLABS_API_KEY> node --strip-types generate-tv-voiceover.ts        -> all 13 scenes
//   ENV_FILE=... node --strip-types generate-tv-voiceover.ts 3 9                               -> only scenes 3 and 9
// Optional: VO_SPEED='{"3":1.05}' to speed up a scene that would overrun.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { TV_SCENES } from "./src/tv/script.ts";

const envFile = process.env.ENV_FILE ?? ".env";
if (!process.env.ELEVENLABS_API_KEY && existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*ELEVENLABS_API_KEY\s*=\s*"?([^"\s]*)"?\s*$/);
    if (m) process.env.ELEVENLABS_API_KEY = m[1];
  }
}
const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error("ELEVENLABS_API_KEY is not set.");
  process.exit(1);
}

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "tnSpp4vdxKPjI9w0GnoV"; // Hope - upbeat and clear
const SPEED: Record<number, number> = JSON.parse(process.env.VO_SPEED ?? "{}");
mkdirSync("public/tv/vo", { recursive: true });
const only = process.argv.slice(2).map(Number).filter(Boolean);

for (const scene of TV_SCENES) {
  if (only.length && !only.includes(scene.no)) continue;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: scene.say ?? scene.vo,
      model_id: "eleven_multilingual_v2",
      // Upbeat but clear; stability keeps the read even across 13 separate scenes
      voice_settings: { stability: 0.55, similarity_boost: 0.78, style: 0.2, use_speaker_boost: true, speed: SPEED[scene.no] ?? 1.0 },
    }),
  });
  if (!res.ok) {
    console.error(`Scene ${scene.no} failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const data = (await res.json()) as { audio_base64: string; alignment: { character_end_times_seconds: number[] } };
  const base = `public/tv/vo/s${String(scene.no).padStart(2, "0")}`;
  writeFileSync(`${base}.mp3`, Buffer.from(data.audio_base64, "base64"));
  writeFileSync(`${base}.json`, JSON.stringify(data.alignment));
  const len = data.alignment.character_end_times_seconds.at(-1) ?? 0;
  const room = scene.to - scene.from - (scene.lead ?? 0);
  console.log(`${scene.no} ${scene.title}: ${len.toFixed(2)}s of ${room.toFixed(1)}s ${len > room - 0.5 ? "<- TOO LONG" : ""}`);
}
