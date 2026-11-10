// Adds viewer-guidance text and logos to src/shots.json, keyed by shot start time.
// Every line is taken or shortened from the voiceover and on-screen wording in the approved script.
//   kicker: one supporting line, lower left        chips: short labels that pop in one by one
//   logos:  brand files in public/brand/, shown on a white tile lower right
//   step:   position in the customer-story tracker (scenes 11 and 12)
//   brand:  logo used on a title card instead of typed text
const fs = require("fs");

const ADD = {
  3: { kicker: "Technology is evolving faster than ever" },
  8: { kicker: "Measured by what businesses achieve" },
  13.5: { kicker: "Ambition into measurable outcomes", chips: ["Cloud", "AI", "Security"] },

  23: { chips: ["Scalable", "Resilient", "Ready for what's next"] },
  25.5: { kicker: "Modern cloud foundations" },

  33: { kicker: "From isolated experiments…" },
  35.5: { kicker: "…to everyday business operations" },
  38: { kicker: "Enterprise data into intelligence" },

  43: { chips: ["Proactive defence", "Continuous monitoring", "Protection in every layer"] },

  50: { logos: ["m365.png", "copilot.png"] },
  53: { kicker: "Empowering people to work smarter" },
  55.5: { kicker: "Secure, AI-enabled productivity", logos: ["m365.png", "copilot.png"] },
  58: { kicker: "In the flow of work" },

  82: { kicker: "The people who architect the solution remain accountable" },

  85: { kicker: "Technology that works for the people using it" },
  88.5: { brand: "intellixperience.png" },
  92: { chips: ["Simpler interactions", "Productive teams", "Connected experiences"], logos: ["intellixperience.png"] },
  99.5: { kicker: "Supporting the way business gets done", logos: ["intellixperience.png"] },
  103: { logos: ["intellixperience.png"] },

  110: { kicker: "Confidence in technology is essential" },
  114: { brand: "intelliassure.png" },
  117.5: { chips: ["Reliability", "Control", "Accountability"], logos: ["intelliassure.png"] },
  125: { kicker: "Foundations ready to support the business", logos: ["intelliassure.png"] },
  129: { logos: ["intelliassure.png"] },

  140: { sub: "Microsoft MISA-verified managed cyber-defence" },
  144: { kicker: "24×7 security operations", logos: ["bluforge-lockup.png"] },
  147: { kicker: "Intelligent threat detection", logos: ["bluforge-lockup.png"] },
  151: { kicker: "Coordinated incident response", logos: ["bluforge-lockup.png"] },
  155: { chips: ["Identity", "Data", "The enterprise as one"] },

  160: { kicker: "Changing the way work gets done" },
  163.5: { brand: "quadra-air.png" },
  167: { kicker: "Engineers directly in your enterprise" },
  171: { chips: ["Identify opportunities", "Redesign workflows"] },
  175: { chips: ["Build governed AI for production"] },
  179: { chips: ["Real workflows", "Real adoption", "Real business outcomes"] },

  185: { step: 1, kicker: "Disconnected systems slow decisions" },
  189: { step: 1, kicker: "More operational effort" },
  193: { step: 2, chips: ["Cloud modernization", "Data foundations", "Managed operations"] },
  197: { step: 2, kicker: "Brought together by Quadra" },
  201: { step: 3, chips: ["Less complexity", "Better visibility", "Faster decisions"] },

  205: { step: 1, kicker: "Security and continuity can't be an afterthought" },
  209: { step: 2, chips: ["Proactive protection", "Continuous monitoring", "Accountable managed services"] },
  213: { step: 2, kicker: "Continuous monitoring" },
  217: { step: 3, chips: ["Stronger resilience", "Confident response"] },
  221: { step: 3, kicker: "Focused on what comes next" },

  228.5: { kicker: "Centre of Excellence for Microsoft AI and Security", logos: ["microsoft.svg"] },
  232.5: { kicker: "Ideas become live demonstrations" },
  236.5: { kicker: "Technology meets real business challenges" },
  240.5: { chips: ["Practical applications of AI"] },
  244: { chips: ["Modern security capabilities"] },
  247.5: { chips: ["Workshops", "Conversations", "Problem-solving"] },

  260: { kicker: "Responsible for making it work" },
  270: { chips: ["Listen", "Collaborate", "Stay accountable"] },

  280: { kicker: "An ambition worth building toward" },
  283.5: { kicker: "The next step begins with a conversation" },
};

// Story labels move into the tracker, so the footage no longer repeats them as headlines
const STORY_LABELS = ["Business Challenge", "Quadra Solution", "Security Solution", "Outcome"];

const shots = JSON.parse(fs.readFileSync("src/shots.json", "utf8"));
for (const shot of shots) {
  for (const k of ["kicker", "chips", "logos", "step", "brand"]) delete shot[k];
  if (shot.s >= 11 && shot.s <= 12 && STORY_LABELS.includes(shot.text)) delete shot.text;
  Object.assign(shot, ADD[shot.t0] ?? {});
}
fs.writeFileSync("src/shots.json", JSON.stringify(shots, null, 1));
console.log("annotated", Object.keys(ADD).length, "shots");
