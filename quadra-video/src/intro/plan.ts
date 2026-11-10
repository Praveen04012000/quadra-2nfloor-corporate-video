// Production plan for the approved storyboard (board.json = storyboard-v3/shots.json, 95 shots).
// SPEC adds the exact on-screen elements per shot (1-based shot number). Times are absolute seconds,
// taken from the ElevenLabs word timings so graphics land on the words they match.
import boardJson from "./board.json";

export type BoardShot = {
  s: number;
  t0: number;
  t1: number;
  type: "footage" | "card" | "ui" | "logo";
  src?: string;
  in?: number;
  speed?: string;
  text?: string;
  trans: string;
};

export type Chip = [label: string, at: number];

export type Spec = {
  head?: string;
  headAt?: number;
  kicker?: string;
  kickerAt?: number;
  chips?: Chip[];
  logos?: string[];
  logosAt?: number;
  num?: { v: string; label: string; at: number };
  recapAt?: number;
  windowNext?: boolean;
  qbuild?: boolean;
  section?: { text: string; fill: number };
  partners?: number[];
  product?: { logo: string; at: number; light: boolean };
  device?: string;
  flip?: number;
  checks?: number;
  incident?: number[];
  workflow?: number[];
  stamp?: { text: string; at: number; shield?: boolean };
  bluforge?: number;
  air?: number;
  grid?: number[];
  role?: { text: string; corner: "tl" | "br" };
  corners?: [string, number, "tl" | "tr" | "bl"][];
  cta?: number;
  logoBuild?: number;
  endCard?: boolean;
};

export const BOARD = boardJson as BoardShot[];
export const FPS = 30;
export const TOTAL = Math.round(BOARD[BOARD.length - 1].t1 * FPS);
export const shotFile = (n: number) => `v3/s${String(n).padStart(3, "0")}.mp4`;

export const SPEC: Record<number, Spec> = {
  1: { qbuild: true },
  6: { windowNext: true },
  7: { chips: [["Cloud", 10.47], ["AI", 11.1], ["Security", 11.75]] },
  8: { kicker: "Ambition into measurable outcomes" },
  9: { section: { text: "Building the Intelligent Enterprise.", fill: 7 } },

  10: { head: "Cloud Modernization." },
  12: { chips: [["Scalable", 24.83], ["Resilient", 25.4], ["Ready for what's next", 25.95]] },
  13: { windowNext: true },
  14: { partners: [27.6, 28.2, 28.8] },

  15: { head: "AI & Data Transformation." },
  16: { kicker: "Enterprise data into intelligence" },
  17: { flip: 35.72 },

  20: { head: "Enterprise Cybersecurity." },
  21: { kicker: "Proactive defence", kickerAt: 42.59 },
  22: { kicker: "Continuous monitoring", kickerAt: 43.73 },
  24: { kicker: "Protection in every layer", kickerAt: 46.71 },

  25: { head: "Workforce Transformation." },
  26: { kicker: "Secure, AI-enabled productivity", kickerAt: 53.32, logos: ["m365.png", "copilot.png"], logosAt: 53.32 },
  28: { kicker: "In the flow of work", kickerAt: 55.72 },

  31: { section: { text: "Why Quadra", fill: 29 } },
  32: { num: { v: "25", label: "Years", at: 61.04 } },
  33: { num: { v: "100+", label: "Awards", at: 65.37 } },
  34: { num: { v: "1,000+", label: "Certifications", at: 70.27 }, windowNext: true },
  35: { partners: [71.74, 72.2, 72.7] },
  36: { kicker: "The people who architect the solution remain accountable", kickerAt: 76.98 },
  37: { num: { v: "3,000+", label: "Customers", at: 79.0 }, recapAt: 82.0 },

  38: { kicker: "Technology that works for the people using it", windowNext: true },
  39: { product: { logo: "intellixperience.png", at: 90.01, light: true } },
  40: { device: "intellixperience.png" },
  41: { chips: [["Simpler interactions", 97.99], ["Productive teams", 98.6], ["Connected experiences", 99.2]] },
  42: { kicker: "Supporting the way business gets done", kickerAt: 100.65 },
  43: { head: "Built Around the Enterprise Experience.", logos: ["intellixperience.png"], logosAt: 103.0 },

  44: { kicker: "Confidence in technology is essential", windowNext: true },
  45: { product: { logo: "intelliassure.png", at: 115.03, light: false } },
  47: { checks: 119.38 },
  49: { kicker: "Foundations ready to support the business", kickerAt: 126.15, head: "Confidence for Enterprise Operations.", headAt: 129.6, logos: ["intelliassure.png"], logosAt: 129.6 },

  50: { stamp: { text: "Cyber threats don't stop.", at: 135.8 } },
  51: { stamp: { text: "Neither should your defence.", at: 137.63, shield: true } },
  52: { bluforge: 139.24, windowNext: true },
  53: { incident: [145.05, 147.47, 149.41, 150.6] },
  55: { kicker: "Visibility and accountability", kickerAt: 152.4 },
  56: { chips: [["Identity", 154.45], ["Data", 155.1], ["The enterprise as one", 155.7]], head: "BluForge — One Unified Defence.", headAt: 156.9, logos: ["bluforge-lockup.png"], logosAt: 156.9 },

  58: { kicker: "Changing the way work gets done", kickerAt: 163.83, windowNext: true },
  59: { air: 166.49 },
  60: { kicker: "Engineers directly in your enterprise" },
  61: { workflow: [174.07, 175.56, 177.05, 178.75] },
  62: { head: "Engineering AI Into the Business.", chips: [["Real workflows", 179.75], ["Real adoption", 180.83], ["Real business outcomes", 182.05]] },

  63: { kicker: "Disconnected systems slow decisions" },
  64: { kicker: "More operational effort" },
  65: { chips: [["Cloud modernization", 192.2], ["Data foundations", 192.8], ["Managed operations", 193.4]] },
  66: { chips: [["Less complexity", 197.5], ["Better visibility", 198.1], ["Faster decisions", 198.7]] },

  68: { kicker: "Security and continuity can't be an afterthought" },
  70: { chips: [["Proactive protection", 212.0], ["Continuous monitoring", 212.6], ["Accountable managed services", 213.2]] },
  71: { chips: [["Stronger resilience", 217.8], ["Confident response", 218.4]] },
  72: { kicker: "Focused on what comes next" },

  73: { section: { text: "Experience Our CoE", fill: 77 } },
  74: { kicker: "Centre of Excellence for Microsoft AI and Security", kickerAt: 228.88, logos: ["microsoft.svg"], logosAt: 228.88 },
  75: { kicker: "Ideas become live demonstrations" },
  76: { kicker: "Technology meets real business challenges" },
  78: { chips: [["Practical applications of AI", 241.04]] },
  79: { chips: [["Modern security capabilities", 243.67]] },
  80: { chips: [["Workshops", 246.0]] },
  81: { chips: [["Conversations", 247.1]] },
  82: { chips: [["Problem-solving", 248.4]] },
  83: { head: "Experience Innovation. Explore What's Possible.", headAt: 251.61, grid: [75, 78, 80] },

  84: { kicker: "Responsible for making it work" },
  85: { role: { text: "Architects.", corner: "tl" } },
  86: { role: { text: "Engineers.", corner: "br" } },
  87: { role: { text: "Security specialists.", corner: "tl" } },
  88: { role: { text: "AI innovators.", corner: "br" } },
  89: { chips: [["Listen", 270.34], ["Collaborate", 270.95], ["Stay accountable", 271.55]] },
  90: { head: "Expertise That Delivers. People Who Stay Accountable.", headAt: 274.49 },

  91: { kicker: "An ambition worth building toward" },
  92: { corners: [["Cloud.", 284.74, "tl"], ["AI.", 285.65, "tr"], ["Security.", 286.84, "bl"]], windowNext: true },
  93: { cta: 287.7 },
  94: { logoBuild: 292.13 },
  95: { endCard: true },
};

// Customer-story trackers: steps change on "Quadra brings / combines" and "Helping"
export const TRACKERS = [
  { from: 185, to: 205, steps: ["Business Challenge", "Quadra Solution", "Outcome"], at: [185, 191.83, 197.25] },
  { from: 205, to: 225, steps: ["Business Challenge", "Security Solution", "Outcome"], at: [205, 211.62, 217.49] },
];

// Layered shield across the cybersecurity cuts
export const SHIELD = { from: 42.5, to: 50, rings: [42.59, 43.73, 46.71], scan: [45, 46.25], done: 47.3 };

// Music bed.
// TEMP (internal review only): the reference video's own music, looped to 5:00 (public/music/reference-temp.wav).
//   It belongs to the reference's owner; do not publish the film with it unless Quadra licenses that track.
// RELEASE: original instrumental generated with ElevenLabs Music (generate-music.ts), matched to the reference's character.
// Set USE_TEMP_MUSIC to false for any external version.
export const USE_TEMP_MUSIC = false; // reference-instrumental.wav not shipped
// Temp track is the user's instrumental of the reference (Downloads/videoplayback (2) - Instrumental.mp3), looped to 5:00
export const MUSIC: string | null = USE_TEMP_MUSIC ? "music/reference-instrumental.wav" : "music/track.mp3";
// Music level in gaps and under the voiceover (linear gain), with short ramps either side of each line
// Track is loudness-matched to the reference (RMS about -17.6 dB); voice is about -23 dB.
// These gains keep the music ~6 dB under the voice level in gaps and ~14 dB under it during speech.
// The instrumental is ~7 dB quieter than the matched track, so its gains are higher
export const MUSIC_MIX = USE_TEMP_MUSIC ? { open: 0.9, underVoice: 0.33, rampFrames: 8 } : { open: 0.4, underVoice: 0.15, rampFrames: 8 };
