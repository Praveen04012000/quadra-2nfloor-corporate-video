// Generates an original, premium instrumental score for the Office TV film with ElevenLabs Music.
// One section per scene (13 sections, 5:00), so musical changes land on the scene changes.
// Usage: ENV_FILE=<.env with ELEVENLABS_API_KEY> node --strip-types generate-tv-music.ts
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

const GLOBAL = [
  "instrumental",
  "100 BPM",
  "premium cinematic corporate technology score",
  "modern, inspiring, innovative, high-end",
  "felt piano motif that returns through the piece",
  "lush string ensemble with emotional swells",
  "pulsing analog synth bass and shimmering arpeggios",
  "tight modern percussion, tasteful, never cheesy",
  "wide, polished, film-trailer quality mix",
  "builds emotion and momentum across the piece",
];
const AVOID = [
  "vocals", "singing", "lyrics", "spoken word",
  "ukulele", "whistling", "hand claps and finger snaps", "generic happy stock music", "elevator music",
  "dubstep", "trap hi-hats", "lo-fi", "distorted guitar",
  "silence", "long fade-out mid-track", "stopping mid-track",
];

// Scene by scene, matching the film's 13 scenes (seconds)
const SECTIONS: [string, number, string[]][] = [
  ["1 The Premise", 20, ["delicate felt piano motif", "airy pads", "a soft pulse enters after eight seconds", "anticipation"]],
  ["2 Cloud", 25, ["soft kick and pulsing synth bass join", "optimistic forward motion", "continuous"]],
  ["3 AI", 30, ["shimmering arpeggios", "strings swell with a sense of wonder", "rising energy", "continuous"]],
  ["4 Productivity and Security", 25, ["steady confident drive", "rhythmic plucks", "continuous"]],
  ["5 BluForge", 25, ["tension: low strings and taut percussion", "darker but controlled", "resolves into strength", "continuous"]],
  ["6 Five Vendors, One Architect", 20, ["powerful and unified", "big cinematic drum hits on the last phrase", "continuous"]],
  ["7 Foundation", 20, ["grounded and steady", "warm low strings", "continuous"]],
  ["8 Operations", 20, ["light reliable pulse", "clean and precise", "continuous"]],
  ["9 How We Engage", 25, ["lift", "piano motif returns with strings", "hopeful", "continuous"]],
  ["10 Experience Our CoE", 25, ["warm, open and human", "inviting", "gentle build", "continuous"]],
  ["11 Why Quadra", 30, ["confident build", "emotional strings rise", "pride", "continuous"]],
  ["12 Trusted by", 20, ["swell to the emotional peak", "anthemic, full strings and synths", "continuous"]],
  ["13 Your Ambition", 15, ["final resolving chord", "piano motif returns softly", "short clean tail"]],
];

const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({
    model_id: "music_v1",
    composition_plan: {
      positive_global_styles: GLOBAL,
      negative_global_styles: AVOID,
      sections: SECTIONS.map(([name, s, styles]) => ({ section_name: name, positive_local_styles: styles, negative_local_styles: [], duration_ms: s * 1000, lines: [] })),
    },
  }),
});
if (!res.ok) {
  console.error(`Music request failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
mkdirSync("public/tv/music", { recursive: true });
writeFileSync("public/tv/music/score.mp3", Buffer.from(await res.arrayBuffer()));
console.log(`Saved public/tv/music/score.mp3 (${SECTIONS.reduce((a, x) => a + x[1], 0)} s planned)`);
