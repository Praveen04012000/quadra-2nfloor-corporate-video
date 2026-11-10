// Cuts each footage shot from the Quadra camera originals into public/qf/shot-NN.mp4 (1080p, 30 fps, muted)
// and points src/shots.json at it. Mapping: footage-map.json.
// Usage: node build-footage.cjs            -> all shots
//        node build-footage.cjs 20 63      -> only the shots starting at 20 s and 63 s
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const bin = path.dirname(require.resolve("@remotion/compositor-win32-x64-msvc/package.json"));
const map = JSON.parse(fs.readFileSync("footage-map.json", "utf8"));
const shots = JSON.parse(fs.readFileSync("src/shots.json", "utf8"));
const only = process.argv.slice(2).map(Number);
fs.mkdirSync("public/qf", { recursive: true });

shots.forEach((shot, i) => {
  if (shot.kind !== "clip") return;
  const entry = map.shots[String(shot.t0)];
  if (!entry) throw new Error(`No footage mapped for the shot at ${shot.t0}s`);
  const [file, inPoint, rate] = entry;
  const out = `qf/shot-${String(i + 1).padStart(2, "0")}.mp4`;
  const len = shot.t1 - shot.t0 + 0.2;

  if (!only.length || only.includes(shot.t0)) {
    execFileSync(path.join(bin, "ffmpeg.exe"), [
      "-v", "error", "-y",
      "-ss", String(inPoint),
      "-itsscale", String(1 / rate),
      "-i", path.join(map.dir, file),
      "-t", String(len),
      "-vf", "scale=1920:1080",
      "-r", "30", "-an",
      "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      path.join("public", out),
    ]);
    console.log(`${out}  <- ${file} @${inPoint}s x${rate}`);
  }

  shots[i] = { s: shot.s, t0: shot.t0, t1: shot.t1, kind: "clip", src: out, source: file, in: inPoint, rate,
    ...(shot.text ? { text: shot.text } : {}), ...(shot.num ? { num: shot.num } : {}), ...(shot.logo ? { logo: true } : {}) };
});

fs.writeFileSync("src/shots.json", JSON.stringify(shots, null, 1));
