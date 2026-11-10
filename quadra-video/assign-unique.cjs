// Footage plan with minimal repetition, applied to the approved storyboard (src/intro/board.before-mso.json -> board.json).
// Rules (checked below):
//   - every clip of the CoE launch film (MSO) and the Fusion 2025 teaser (EVT) is used at most once
//   - each office camera clip (C5xxx, SUNRISE) is used at most twice, in different scenes, never the same moment
//   - every MSO/EVT piece sits inside one clean shot of its film (footage-index/*.json)
// A shot is either one piece [src, in, rate] or a quick montage `parts: [[src, in, rate, seconds], ...]`.
const fs = require("fs");

const M = 0.6; // MSO 50 fps -> 30 fps slow motion
const H = 0.5; // office camera 100 fps -> half speed
const PLAN = {
  1: ["SUNRISE", 0.2, 1], 2: ["C5548", 2, H], 3: ["MSO", 7.0, M], 4: ["C5351", 1, H], 5: ["EVT", 34.6, 1],
  6: ["MSO", 20.76, M], 7: ["C5450", 1, H], 8: ["MSO", 8.37, H],
  10: ["MSO", 15.25, H], 11: ["MSO", 9.74, M], 12: ["MSO", 19.38, M], 13: ["MSO", 48.18, M],
  15: ["C5531", 5, H], 16: ["C5444", 9, H], 17: ["MSO", 2.86, H], 18: ["MSO", 4.24, M], 19: ["MSO", 63.56, M],
  20: ["MSO", 13.88, H], 21: ["MSO", 16.62, M], 22: ["C5514", 10, H], 23: ["MSO", 0.06, M], 24: ["C5460", 9, H],
  25: ["MSO", 11.12, H], 26: ["EVT", 39.43, 1], 27: ["MSO", 5.62, M], 28: ["EVT", 48.28, 1], 29: ["EVT", 28.0, 1], 30: ["MSO", 33.18, M],
  32: ["MSO", 25.02, M], 33: ["C5527", 0.5, H], 34: ["EVT", 29.8, 1], 36: ["C5523", 1, H], 37: ["C5515", 6, H],
  38: ["C5504", 2, H], 40: ["C5473", 36, H], 41: ["C5444", 15, H], 42: ["C5538", 20, H], 43: ["C5460", 1, H],
  44: ["C5363", 14, H], 46: ["MSO", 1.48, M], 47: ["MSO", 36.02, M], 48: ["C5393", 4, H], 49: ["C5353", 6, H],
  53: ["C5544", 13, H], 54: ["C5472", 2, H], 55: ["C5473", 4, H], 56: ["C5452", 22, H],
  57: { parts: [["EVT", 21.5, 1, 0.625], ["EVT", 22.33, 1, 0.625], ["EVT", 23.17, 1, 0.625], ["EVT", 19.75, 1, 0.625]] },
  58: ["C5363", 22, H], 60: ["C5396", 1, H], 61: ["C5458", 14, H], 62: ["C5472", 22, H],
  63: ["C5556", 0.3, H], 64: ["C5393", 0, H], 65: ["C5485", 18, H], 66: ["C5514", 20, H], 67: ["C5396", 14, H],
  68: ["C5544", 4, H], 69: ["C5452", 6, H], 70: ["C5359", 1, H], 71: ["C5369", 2, H], 72: ["C5515", 14, H],
  74: ["MSO", 27.9, M], 75: ["MSO", 59.6, M], 76: ["MSO", 54.7, M], 77: ["MSO", 30.6, M], 78: ["MSO", 51.12, H],
  79: ["MSO", 52.5, M], 80: ["MSO", 18.0, M], 81: ["MSO", 62.3, M], 82: ["C5458", 5, H], 83: ["C5517", 3, H],
  84: ["C5359", 6.6, H], 85: ["EVT", 51.55, 1],
  86: { parts: [["EVT", 57.14, 1, 0.625], ["EVT", 53.97, 1, 0.625]] },
  87: { parts: [["EVT", 54.8, 1, 0.625], ["EVT", 57.93, 1, 0.625]] },
  88: { parts: [["EVT", 47.42, 1, 0.625], ["EVT", 46.59, 1, 0.625]] },
  89: { parts: [["EVT", 10.18, 1, 0.6], ["EVT", 14.18, 1, 0.7], ["EVT", 15.06, 1, 0.7], ["EVT", 18.85, 1, 0.7], ["EVT", 16.64, 1, 0.6], ["EVT", 13.35, 1, 0.45]] },
  90: ["C5538", 25, H], 91: ["EVT", 59.6, 1], 92: ["C5450", 12, H],
};

const board = JSON.parse(fs.readFileSync("src/intro/board.before-mso.json", "utf8"));
const speedLabel = (src, rate) => (src === "EVT" ? "100% (24 fps source)" : src === "MSO" ? `${Math.round(rate * 100)}% (50 fps source)` : rate === 1 ? "100%" : "50%");
board.forEach((s, i) => {
  if (!s.src) return;
  const p = PLAN[i + 1];
  if (!p) throw new Error(`No footage planned for shot ${i + 1}`);
  delete s.parts;
  if (Array.isArray(p)) {
    const [src, inPoint, rate] = p;
    Object.assign(s, { src, in: inPoint, rate, speed: speedLabel(src, rate) });
  } else {
    const len = s.t1 - s.t0;
    const sum = p.parts.reduce((a, x) => a + x[3], 0);
    if (Math.abs(sum - len) > 0.01) throw new Error(`Shot ${i + 1}: montage is ${sum}s, shot is ${len}s`);
    Object.assign(s, { src: "MONTAGE", in: 0, rate: 1, speed: "Montage", parts: p.parts });
  }
});
fs.writeFileSync("src/intro/board.json", JSON.stringify(board, null, 1));

// ---------- Audit ----------
const CLEAN = { MSO: require("./footage-index/mso-segments.json"), EVT: require("./footage-index/evt-segments.json") };
const pieces = [];
board.forEach((s, i) => {
  if (!s.src) return;
  if (s.parts) s.parts.forEach(([src, a, rate, d]) => pieces.push({ n: i + 1, scene: s.s, src, a, e: a + d * rate }));
  else pieces.push({ n: i + 1, scene: s.s, src: s.src, a: s.in, e: s.in + (s.t1 - s.t0) * s.rate });
});
let problems = 0;
const fail = (m) => { console.log(m); problems++; };
const bySeg = {};
for (const p of pieces) {
  if (CLEAN[p.src]) {
    const k = CLEAN[p.src].findIndex(([x, y]) => p.a >= x - 0.01 && p.a < y);
    if (k < 0 || p.e > CLEAN[p.src][k][1] + 0.01) fail(`shot ${p.n}: ${p.src} ${p.a.toFixed(2)}-${p.e.toFixed(2)} not inside one clean shot`);
    const key = `${p.src}#${k}`;
    if (bySeg[key]) fail(`shot ${p.n}: ${p.src} clip ${k + 1} already used in shot ${bySeg[key]}`);
    bySeg[key] = p.n;
  }
}
const byClip = {};
for (const p of pieces) if (!CLEAN[p.src]) (byClip[p.src] = byClip[p.src] || []).push(p);
for (const [clip, list] of Object.entries(byClip)) {
  if (list.length > 2) fail(`${clip} used ${list.length} times`);
  if (list.length === 2) {
    if (list[0].scene === list[1].scene) fail(`${clip} used twice in scene ${list[0].scene}`);
    const [x, y] = list.sort((u, v) => u.a - v.a);
    if (y.a < x.e) fail(`${clip}: shots ${x.n} and ${y.n} overlap`);
  }
}
const twice = Object.entries(byClip).filter(([, l]) => l.length === 2).map(([c, l]) => `${c}(${l.map((p) => p.n).join("+")})`);
console.log(`problems: ${problems}`);
console.log(`new-film clips used once each: ${Object.keys(bySeg).length}; office clips used once: ${Object.values(byClip).filter((l) => l.length === 1).length}, twice in different scenes: ${twice.length}`);
console.log("used twice:", twice.join(" "));
