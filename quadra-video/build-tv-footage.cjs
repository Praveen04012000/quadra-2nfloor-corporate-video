// Cuts the Office TV footage (src/tv/footage.json) into public/tv/f/<id>.mp4 at 1080p, 25 fps, muted,
// and audits it: office clips at most twice and in different scenes, CoE film / teaser clips once each,
// every piece inside one clean shot of its film (footage-index/*.json), no repeated moments.
// Usage: node build-tv-footage.cjs [id ...]   (FOOTAGE=src/intro2/footage.json for the QuadraIntro list)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const bin = path.dirname(require.resolve("@remotion/compositor-win32-x64-msvc/package.json"));
const DIR = "C:/Users/AbisreeNandhakumar/Documents/AIG_corporate_Videos";
const FILE = {
  SUNRISE: "s01-quadra-sunrise (1).mp4", C5556: "C5556 (1).MP4", C5538: "c5538.mp4",
  MSO: "C:/Users/AbisreeNandhakumar/Downloads/Quadra Microsoft -Office .mp4",
  EVT: "C:/Users/AbisreeNandhakumar/Downloads/4.Event Teaser.mp4",
};
const src = (s) => (path.isAbsolute(FILE[s] || "") ? FILE[s] : path.join(DIR, FILE[s] || `${s}.MP4`));
const shots = JSON.parse(fs.readFileSync(process.env.FOOTAGE || "src/tv/footage.json", "utf8"));
const scenes = require("./src/tv/scenes-index.json");
const sceneOf = (t) => scenes.findIndex(([a, b]) => t >= a && t < b) + 1;

// ---- audit ----
const CLEAN = { MSO: require("./footage-index/mso-segments.json"), EVT: require("./footage-index/evt-segments.json") };
let problems = 0;
const fail = (m) => { console.log(m); problems++; };
const seen = {}, byClip = {};
for (const s of shots) {
  const a = s.in, e = s.in + (s.to - s.from) * s.rate;
  if (CLEAN[s.src]) {
    const k = CLEAN[s.src].findIndex(([x, y]) => a >= x - 0.01 && a < y);
    if (k < 0 || e > CLEAN[s.src][k][1] + 0.01) fail(`${s.id}: ${s.src} ${a.toFixed(2)}-${e.toFixed(2)} not inside one clean shot`);
    if (seen[`${s.src}#${k}`]) fail(`${s.id}: ${s.src} clip ${k + 1} already used by ${seen[`${s.src}#${k}`]}`);
    seen[`${s.src}#${k}`] = s.id;
  } else (byClip[s.src] = byClip[s.src] || []).push({ id: s.id, a, e, scene: sceneOf(s.from) });
}
for (const [c, l] of Object.entries(byClip)) {
  if (l.length > 2) fail(`${c} used ${l.length} times`);
  if (l.length === 2) {
    if (l[0].scene === l[1].scene) fail(`${c} used twice in scene ${l[0].scene}`);
    const [x, y] = l.sort((u, v) => u.a - v.a);
    if (y.a < x.e) fail(`${c}: ${x.id} and ${y.id} overlap`);
  }
}
console.log(`audit problems: ${problems}`);
if (problems) process.exit(1);

// ---- cut ----
const only = process.argv.slice(2);
fs.mkdirSync("public/tv/f", { recursive: true });
for (const s of shots) {
  if (only.length && !only.includes(s.id)) continue;
  execFileSync(path.join(bin, "ffmpeg.exe"), [
    "-v", "error", "-y", "-ss", String(s.in), "-itsscale", String(1 / s.rate), "-i", src(s.src),
    "-t", String(s.to - s.from + 0.2), "-vf", "scale=1920:1080", "-r", "25", "-an",
    "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    path.join("public/tv/f", `${s.id}.mp4`),
  ]);
  console.log(`${s.id} <- ${s.src} @${s.in}s x${s.rate}`);
}
