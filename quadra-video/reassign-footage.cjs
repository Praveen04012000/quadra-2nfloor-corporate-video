// Reassigns footage so no two shots share any moment of any source clip, and brings in
//   MSO: the Quadra CoE launch film (Downloads/Quadra Microsoft -Office .mp4, 50 fps)
//   EVT: the Quadra Fusion 2025 event teaser (Downloads/4.Event Teaser.mp4, 24 fps, played at normal speed)
// Clean shot ranges of both films (frame-accurate cut detection) are in footage-index/.
// Writes src/intro/board.json, then audits every source range for overlaps.
const fs = require("fs");

const MSO_RATE = 0.6; // 50 fps source -> smooth 30 fps slow motion
// shot number -> [source, in-point (s), playback rate, framing note]
const CHANGES = {
  3: ["MSO", 7.0, MSO_RATE, "Quadra logo wall (CoE launch film)"],
  11: ["MSO", 15.28, MSO_RATE, "CoE lab with orange desks"],
  17: ["C5514", 0.5, 0.5, "White office, blurred behind the glass panel"],
  18: ["MSO", 8.6, MSO_RATE, "'01 Ambition: Work with AI' room sign"],
  27: ["MSO", 11.3, MSO_RATE, "Lab with the Copilot logo"],
  32: ["C5515", 0.5, 0.5, "Wide office under the orange wall"],
  38: ["C5504", 5.0, 0.5, "Row of colleagues"],
  43: ["C5460", 1.0, 0.5, "Mentoring, slow push"],
  61: ["C5460", 19.0, 0.5, "Mentoring, blurred behind the workflow panel"],
  64: ["C5393", 0.0, 0.5, "Leader at the desks"],
  67: ["C5396", 14.0, 0.5, "Meeting room smiles"],
  74: ["MSO", 27.9, MSO_RATE, "Leaders at the 'Centre of Excellence for Microsoft AI & Security' sign"],
  75: ["MSO", 59.6, MSO_RATE, "CoE lab with the launch guests"],
  76: ["MSO", 54.7, MSO_RATE, "Team in the CoE lab"],
  77: ["MSO", 30.6, MSO_RATE, "Ribbon-cutting at the CoE entrance"],
  78: ["MSO", 51.12, 0.5, "Copilot logo wall in the CoE"],
  79: ["MSO", 13.88, 0.5, "'02 Trust: Secure the AI' room sign"],
  80: ["MSO", 18.0, MSO_RATE, "CoE workshop room"],
  81: ["MSO", 62.3, MSO_RATE, "Conversation on the CoE terrace"],
  84: ["C5359", 6.6, 0.5, "Leader walks toward camera"],
  86: ["C5458", 18.0, 0.5, "Engineers"],
  87: ["C5472", 12.0, 0.5, "Security analyst at dark UI"],
  92: ["MSO", 25.2, MSO_RATE, "Team at the CoE launch"],
  34: ["EVT", 29.8, 1, "Full team seated outdoors at Fusion 2025"],
  85: ["EVT", 51.55, 1, "Leaders together at Fusion 2025"],
  5: ["EVT", 34.6, 1, "The team cheering at Fusion 2025"],
  91: ["EVT", 59.6, 1, "Fusion 2025 group celebration"],
};

const board = JSON.parse(fs.readFileSync("src/intro/board.json", "utf8"));
for (const [n, [src, inPoint, rate, frame]] of Object.entries(CHANGES)) {
  const shot = board[Number(n) - 1];
  if (!shot.src) throw new Error(`Shot ${n} has no footage`);
  Object.assign(shot, { src, in: inPoint, rate, speed: src === "MSO" ? `${Math.round(rate * 100)}% (50 fps source)` : src === "EVT" ? "100% (24 fps source)" : "50%", frame });
}
// Every footage shot carries an explicit rate from now on
board.forEach((s) => {
  if (s.src && s.rate === undefined) s.rate = s.speed.startsWith("100%") && !s.speed.includes("→") ? 1 : 0.5;
});
fs.writeFileSync("src/intro/board.json", JSON.stringify(board, null, 1));

// Audit: source ranges must not overlap; MSO shots must stay inside one shot of the launch film
const CLEAN = { MSO: require("./footage-index/mso-segments.json"), EVT: require("./footage-index/evt-segments.json") };
const uses = {};
let problems = 0;
board.forEach((s, i) => {
  if (!s.src) return;
  const a = s.in, e = s.in + (s.t1 - s.t0) * s.rate;
  (uses[s.src] = uses[s.src] || []).push({ n: i + 1, a, e });
  if (CLEAN[s.src]) {
    const seg = CLEAN[s.src].find(([x, y]) => a >= x - 0.01 && a < y);
    if (!seg || e > seg[1] + 0.01) { console.log(`shot ${i + 1}: ${s.src} ${a.toFixed(2)}-${e.toFixed(2)} is not inside one clean shot`); problems++; }
  }
});
for (const [k, v] of Object.entries(uses)) {
  v.sort((x, y) => x.a - y.a);
  for (let i = 1; i < v.length; i++) if (v[i].a < v[i - 1].e - 0.01) { console.log(`overlap ${k}: shots ${v[i - 1].n} & ${v[i].n}`); problems++; }
}
console.log(`changed ${Object.keys(CHANGES).length} shots; sources in use: ${Object.keys(uses).length}; problems: ${problems}`);
console.log("max uses per clip:", Object.entries(uses).map(([k, v]) => `${k}:${v.length}`).join(" "));
