// Generates the Quadra voiceover with ElevenLabs: one MP3 per scene plus word timings for the captions.
// Voice: "Hope – upbeat and clear". Script text comes from src/scenes/data.ts, unchanged.
// Usage:
//   node --strip-types generate-voiceover.ts          -> all 15 scenes
//   node --strip-types generate-voiceover.ts 7 13     -> only scenes 7 and 13
// The API key is read from ELEVENLABS_API_KEY, or from the .env file named in ENV_FILE.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { SCENES } from "./src/scenes/data.ts";
import { spoken } from "./src/voiceover.ts";

const envFile = process.env.ENV_FILE ?? ".env";
if (!process.env.ELEVENLABS_API_KEY && existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*ELEVENLABS_API_KEY\s*=\s*"?([^"\s]*)"?\s*$/);
    if (m) process.env.ELEVENLABS_API_KEY = m[1];
  }
}
const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error("ELEVENLABS_API_KEY is not set. Set it, or point ENV_FILE at a .env file that has it.");
  process.exit(1);
}

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "tnSpp4vdxKPjI9w0GnoV";
// Per-scene speed, raised only where a line would overrun its slot
const SPEED: Record<number, number> = JSON.parse(process.env.VO_SPEED ?? "{}");

mkdirSync("public/voiceover", { recursive: true });
const only = process.argv.slice(2).map(Number).filter(Boolean);

for (const [i, scene] of SCENES.entries()) {
  const no = i + 1;
  if (only.length && !only.includes(no)) continue;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: spoken(scene.vo),
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.42, similarity_boost: 0.78, style: 0.4, use_speaker_boost: true, speed: SPEED[no] ?? 1.0 },
    }),
  });
  if (!res.ok) {
    console.error(`Scene ${no} failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const data = (await res.json()) as {
    audio_base64: string;
    alignment: { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
  };
  const base = `public/voiceover/s${String(no).padStart(2, "0")}`;
  writeFileSync(`${base}.mp3`, Buffer.from(data.audio_base64, "base64"));
  writeFileSync(`${base}.json`, JSON.stringify(data.alignment));
  const end = data.alignment.character_end_times_seconds.at(-1) ?? 0;
  console.log(`${no} ${scene.title}: ${end.toFixed(2)}s of ${scene.seconds}s`);
}
