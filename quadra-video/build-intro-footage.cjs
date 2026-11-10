// Cuts every footage shot of the edit (src/intro/board.json) from the source films into public/v3/sNNN.mp4
// (1080p, 30 fps, muted). Slow motion comes from high-frame-rate sources (100 fps office camera, 50 fps CoE film).
// Montage shots ("parts") are cut piece by piece and joined into one file.
// Usage: node build-intro-footage.cjs          -> all shots
//        node build-intro-footage.cjs 17 44    -> only shots 17 and 44 (1-based)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const bin = path.dirname(require.resolve("@remotion/compositor-win32-x64-msvc/package.json"));
const ffmpeg = path.join(bin, "ffmpeg.exe");
const DIR = "C:/Users/AbisreeNandhakumar/Documents/AIG_corporate_Videos";
const FILE = {
  SUNRISE: "s01-quadra-sunrise (1).mp4",
  C5556: "C5556 (1).MP4",
  C5538: "c5538.mp4",
  // Quadra CoE launch film, 50 fps
  MSO: "C:/Users/AbisreeNandhakumar/Downloads/Quadra Microsoft -Office .mp4",
  // Quadra Fusion 2025 event teaser, 4K 24 fps
  EVT: "C:/Users/AbisreeNandhakumar/Downloads/4.Event Teaser.mp4",
};
const sourcePath = (src) => (path.isAbsolute(FILE[src] || "") ? FILE[src] : path.join(DIR, FILE[src] || `${src}.MP4`));

const cut = (src, inPoint, rate, seconds, out) =>
  execFileSync(ffmpeg, [
    "-v", "error", "-y",
    "-ss", String(inPoint),
    "-itsscale", String(1 / rate),
    "-i", sourcePath(src),
    "-t", String(seconds),
    "-vf", "scale=1920:1080",
    "-r", "30", "-an",
    "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    out,
  ]);

const shots = JSON.parse(fs.readFileSync("src/intro/board.json", "utf8"));
const only = process.argv.slice(2).map(Number);
fs.mkdirSync("public/v3/parts", { recursive: true });

shots.forEach((shot, i) => {
  if (!shot.src || (only.length && !only.includes(i + 1))) return;
  const out = path.join("public/v3", `s${String(i + 1).padStart(3, "0")}.mp4`);
  if (shot.parts) {
    // Cut each piece exactly, then join them without re-encoding
    const files = shot.parts.map(([src, inPoint, rate, seconds], k) => {
      const f = path.join("public/v3/parts", `s${String(i + 1).padStart(3, "0")}-${k + 1}.mp4`);
      cut(src, inPoint, rate, seconds, f);
      return f;
    });
    const list = path.join("public/v3/parts", `s${String(i + 1).padStart(3, "0")}.txt`);
    fs.writeFileSync(list, files.map((f) => `file '${path.resolve(f).replace(/\\/g, "/")}'`).join("\n"));
    execFileSync(ffmpeg, ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", "-movflags", "+faststart", out]);
    console.log(`${out} <- montage of ${shot.parts.length} clips`);
    return;
  }
  const rate = shot.rate ?? (shot.speed.startsWith("100%") && !shot.speed.includes("→") ? 1 : 0.5);
  // 0.3 s of spare tail; the edit only shows the shot's own length
  cut(shot.src, shot.in, rate, shot.t1 - shot.t0 + 0.3, out);
  console.log(`${out} <- ${shot.src} @${shot.in}s x${rate}`);
});
