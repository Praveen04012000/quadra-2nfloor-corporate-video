// Generates an original, instrumental 5:00 music bed with ElevenLabs Music, following the storyboard's
// music plan (Part 5): 96 BPM, bright modern corporate electronic, sections timed to the scenes.
// It is inspired by the reference's mood and energy, not a copy of its music.
// Usage: ENV_FILE=<path to .env with ELEVENLABS_API_KEY> node --strip-types generate-music.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

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

// Brief tuned to measurements of the reference's music (character only, not its melody or arrangement):
// 103 BPM, D major, bright mid-forward mix, light low end, dynamic; soft quarter-note kick, light eighth-note hats,
// sustained legato chords in the mids (little rhythmic movement there), steady energy after a 5 s intro.
const GLOBAL = [
  "instrumental",
  "103 BPM",
  "D major",
  "uplifting modern corporate technology",
  "smooth and flowing",
  "sustained legato pads and warm chords carry the harmony",
  "soft, gentle kick on every beat, not punchy",
  "light eighth-note hi-hats and shaker",
  "clean piano and soft synth textures",
  "bright, airy, open mix with light low end",
  "dynamic, not over-compressed",
  "steady consistent energy throughout",
  "polished, optimistic, professional",
];
const AVOID = [
  "vocals", "singing", "lyrics", "spoken word",
  "heavy sub-bass", "booming 808", "dark", "muddy", "brooding",
  "busy arpeggios", "staccato stabs", "hard punchy kick", "big drops", "breakdowns",
  "distorted guitar", "trap hi-hats", "dubstep wobble", "lo-fi", "orchestral epic",
  "silence", "long fade-out", "stopping mid-track",
];

// Section boundaries still land on the edit's scene changes; energy stays steady like the reference,
// with only gentle lifts where the film's big moments are (1:00, 2:15, 3:45)
const SECTIONS = [
  { name: "Intro", ms: 5000, styles: ["short airy intro", "soft pads and piano", "no drums"] },
  { name: "Groove", ms: 55000, styles: ["soft kick and light hats enter", "flowing chords", "steady groove", "continuous"] },
  { name: "Lift 1", ms: 25000, styles: ["gentle lift", "fuller pads", "same groove", "continuous"] },
  { name: "Groove 2", ms: 50000, styles: ["steady groove", "flowing chords", "continuous"] },
  { name: "Lift 2", ms: 50000, styles: ["slightly more driving", "same mood", "continuous"] },
  { name: "Groove 3", ms: 40000, styles: ["steady groove, slightly lighter", "warm piano", "continuous"] },
  { name: "Lift 3", ms: 62500, styles: ["gentle final lift", "fuller and brighter", "same groove", "continuous"] },
  { name: "Outro", ms: 12500, styles: ["resolve on a sustained chord", "short reverb tail", "clean ending"] },
];

const body = {
  model_id: "music_v1",
  composition_plan: {
    positive_global_styles: GLOBAL,
    negative_global_styles: AVOID,
    sections: SECTIONS.map((s) => ({
      section_name: s.name,
      positive_local_styles: s.styles,
      negative_local_styles: [],
      duration_ms: s.ms,
      lines: [],
    })),
  },
};

const total = SECTIONS.reduce((a, s) => a + s.ms, 0);
console.log(`Requesting ${SECTIONS.length} sections, ${total / 1000}s total`);
const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
if (!res.ok) {
  console.error(`Music request failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
mkdirSync("public/music", { recursive: true });
writeFileSync("public/music/track.mp3", Buffer.from(await res.arrayBuffer()));
console.log("Saved public/music/track.mp3");
