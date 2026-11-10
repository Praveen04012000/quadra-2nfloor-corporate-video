// Quadra Office TV Intro Video, script from "Quadra Office TV Intro Video — Production Pack" (26 Oct 2026).
// `vo` is the approved wording. `say` is what the voice reads where pronunciation needs help (pack's notes).
// `lead` is the silence before the line starts (scene 1 opens with 3 s of logo reveal, music only).

export type TvScene = { no: number; title: string; from: number; to: number; vo: string; say?: string; lead?: number };

export const TV_FPS = 25;
export const TV_SECONDS = 300;

export const TV_SCENES: TvScene[] = [
  {
    no: 1, title: "The Premise", from: 0, to: 20, lead: 3,
    vo: "Technology capability compounds every quarter. Enterprise adoption doesn't. Powerful engines don't move enterprises. Transmissions do. Across cloud, AI and security, Quadra is the transmission that turns raw capability into business outcomes.",
  },
  {
    no: 2, title: "Cloud", from: 20, to: 45,
    vo: "Three clouds. One architect. Quadra holds Microsoft Frontier, AWS Premier and Google Cloud Premier status at the same time, so every workload lands on the right platform, on merit. And Quadra Max-IT brings AI-driven cloud operations and FinOps, keeping spend governed and environments tuned.",
    say: "Three clouds. One architect. Quadra holds Microsoft Frontier, A-W-S Premier and Google Cloud Premier status at the same time, so every workload lands on the right platform, on merit. And Quadra Max I-T brings A-I driven cloud operations and Fin-Ops, keeping spend governed and environments tuned.",
  },
  {
    no: 3, title: "AI", from: 45, to: 75,
    vo: "AI demonstrations are everywhere. AI in production is rare. Quadra's AI already serves over one hundred thousand daily users. Intellient, our agentic AI platform, designs, orchestrates and governs agents at enterprise scale. IntelliLink puts enterprise data into natural language, inside the tools teams already use. One hundred per cent proprietary, and ISO/IEC 42001 certified.",
    say: "A-I demonstrations are everywhere. A-I in production is rare. Quadra's A-I already serves over one hundred thousand daily users. Intellient, our agentic A-I platform, designs, orchestrates and governs agents at enterprise scale. Intelli-Link puts enterprise data into natural language, inside the tools teams already use. One hundred per cent proprietary, and I-S-O, I-E-C forty-two thousand and one certified.",
  },
  {
    no: 4, title: "Productivity and Security", from: 75, to: 100,
    vo: "From Copilot adoption to Sentinel operations, Quadra runs the full Microsoft 365 lifecycle under one accountable team. Modern work and Copilot, with Workspace MigrationX. Security and compliance, with Threat Doctor. Threat protection, with DefendX. Hybrid integration, with SCCM InsightX.",
    say: "From Copilot adoption to Sentinel operations, Quadra runs the full Microsoft three-sixty-five lifecycle under one accountable team. Modern work and Copilot, with Workspace Migration-X. Security and compliance, with Threat Doctor. Threat protection, with Defend-X. Hybrid integration, with S-C-C-M Insight-X.",
  },
  {
    no: 5, title: "BluForge", from: 100, to: 125,
    vo: "Cyber threats don't stop. Neither does BluForge. Quadra's managed cyber-defence platform, independently verified by Microsoft under the MISA MXDR programme. Twenty-four-by-seven operations, AI-led threat hunting and automated response, unified in the BluForge Security Center. Identity to data, defended as one.",
    say: "Cyber threats don't stop. Neither does Blu-Forge. Quadra's managed cyber-defence platform, independently verified by Microsoft under the Mee-sah, M-X-D-R programme. Twenty-four-by-seven operations, A-I led threat hunting and automated response, unified in the Blu-Forge Security Center. Identity to data, defended as one.",
  },
  {
    no: 6, title: "Five Vendors, One Architect", from: 125, to: 145,
    vo: "Beyond Microsoft, Quadra engineers Zscaler, CrowdStrike, Fortinet, Sophos and Barracuda into a single defence, every signal feeding BluForge, under one signed SLA. Five leaders. One defence. One accountability.",
    say: "Beyond Microsoft, Quadra engineers Zscaler, CrowdStrike, Fortinet, Sophos and Barracuda into a single defence, every signal feeding Blu-Forge, under one signed S-L-A. Five leaders. One defence. One accountability.",
  },
  {
    no: 7, title: "Foundation", from: 145, to: 165,
    vo: "Not every workload belongs in the public cloud. Across VMware, Citrix and Omnissa, with Commvault and Veeam protecting every estate, Quadra builds private and hybrid infrastructure that doesn't blink.",
  },
  {
    no: 8, title: "Operations", from: 165, to: 185,
    vo: "Always on. Always accountable. Cloud, Microsoft 365, security and on-premises operations: four managed estates, each measured against a defined SLA, unified under one tier. ProAct-plus.",
    say: "Always on. Always accountable. Cloud, Microsoft three-sixty-five, security and on-premises operations: four managed estates, each measured against a defined S-L-A, unified under one tier. Pro-Act plus.",
  },
  {
    no: 9, title: "How We Engage", from: 185, to: 210,
    vo: "Every engagement moves in three steps. Diagnose. Architect. Operate. With Quadra AIR, AI-in-Residence, our engineers work inside your organisation, rewiring workflows around AI rather than deploying a tool and walking away. If AI existed from the beginning, would you even do this task this way?",
    say: "Every engagement moves in three steps. Diagnose. Architect. Operate. With Quadra Air, A-I in Residence, our engineers work inside your organisation, rewiring workflows around A-I rather than deploying a tool and walking away. If A-I existed from the beginning, would you even do this task this way?",
  },
  {
    no: 10, title: "Experience Our CoE", from: 210, to: 235,
    vo: "At the Quadra Centre of Excellence for Microsoft AI and Security, these ideas become live demonstrations. Explore practical AI, experience modern security, and work through real challenges with our experts. Because the best way to understand transformation is to see it in action.",
    say: "At the Quadra Centre of Excellence for Microsoft A-I and Security, these ideas become live demonstrations. Explore practical A-I, experience modern security, and work through real challenges with our experts. Because the best way to understand transformation is to see it in action.",
  },
  {
    // Voice waits for the scene title, so "Twenty-five years" lands with its counter
    no: 11, title: "Why Quadra", from: 235, to: 265, lead: 2.4,
    vo: "Twenty-five years. Four principles. Outcome-led. Vendor-agnostic. Senior leadership. Local accountability. And one promise: the people who scope your engagement are still running it. Over one hundred awards, with twenty consecutive years of global recognition. More than one thousand certifications. Over three thousand customers.",
  },
  {
    no: 12, title: "Trusted by India's Most Ambitious Enterprises", from: 265, to: 285,
    vo: "Today, Quadra is trusted by India's most ambitious enterprises, from leading banks and global pharmaceutical majors to iconic automakers and defence innovators, with teams across eight cities.",
  },
  {
    no: 13, title: "Your Ambition", from: 285, to: 300,
    vo: "What is your enterprise ambition? Let's architect what's next. Quadra. Architecting Ambition.",
  },
];

// Sentence splitter shared by caption/graphic timing (spoken and written forms keep the same sentence count)
export const sentences = (text: string) => text.split(/(?<=[.!?])\s+/);
