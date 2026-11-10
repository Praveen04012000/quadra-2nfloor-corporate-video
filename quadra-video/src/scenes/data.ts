// Script content from the Quadra 5-minute storyboard. Do not edit wording.
// `stock`: optional clip in public/stock/ (e.g. "stock/scene-01.mp4"). When empty, the AI still in public/frames/ is used.

export type SceneData = {
  id: string;
  title: string;
  seconds: number;
  vo: string;
  ost?: string;
  metrics?: [string, string][];
  flow?: [string, string, string];
  stock?: string;
};

export const FPS = 30;

export const SCENES: SceneData[] = [
  {
    id: "Scene01-Welcome",
    title: "Welcome to Quadra",
    seconds: 20,
    vo: "Technology is evolving faster than ever. But real progress isn't measured by what technology can do. It's measured by what businesses achieve with it. At Quadra, we connect cloud, AI, and security to turn enterprise ambition into measurable outcomes.",
    ost: "Building the Intelligent Enterprise.",
  },
  {
    id: "Scene02-Cloud",
    title: "Cloud Modernization",
    seconds: 10,
    vo: "We modernize cloud foundations, helping enterprises build infrastructure that is scalable, resilient, and ready for what's next.",
    ost: "Cloud Modernization.",
  },
  {
    id: "Scene03-AIData",
    title: "AI & Data",
    seconds: 10,
    vo: "We turn enterprise data into intelligence, bringing AI from isolated experiments into everyday business operations.",
    ost: "AI & Data Transformation.",
  },
  {
    id: "Scene04-Cybersecurity",
    title: "Cybersecurity",
    seconds: 10,
    vo: "We secure digital environments with proactive defence, continuous monitoring, and protection built into every layer.",
    ost: "Enterprise Cybersecurity.",
  },
  {
    id: "Scene05-Workforce",
    title: "Workforce Transformation",
    seconds: 10,
    vo: "And we empower people to work smarter, bringing secure, AI-enabled productivity into the flow of work.",
    ost: "Workforce Transformation.",
  },
  {
    id: "Scene06-WhyQuadra",
    title: "Why Quadra",
    seconds: 25,
    vo: "For twenty-five years, Quadra has helped enterprises navigate technological change. Recognized across leading global technology ecosystems, we bring deep expertise, certified capabilities, and partnerships spanning Microsoft, AWS, and Google Cloud. Our promise is simple: the people who architect the solution remain accountable for its success.",
    metrics: [
      ["25", "Years"],
      ["100+", "Awards"],
      ["1,000+", "Certifications"],
      ["3,000+", "Customers"],
    ],
  },
  {
    id: "Scene07-IntelliXperience",
    title: "IntelliXperience",
    seconds: 25,
    vo: "Enterprise transformation succeeds when technology works for the people using it. IntelliXperience is part of Quadra's approach to making enterprise experiences more connected and effective. Bringing the focus back to what matters: simpler interactions, productive teams, and technology that supports the way business gets done.",
    ost: "Built Around the Enterprise Experience.",
  },
  {
    id: "Scene08-IntelliAssure",
    title: "IntelliAssure",
    seconds: 25,
    vo: "As enterprises evolve, confidence in their technology becomes essential. IntelliAssure reflects Quadra's focus on building enterprise solutions with reliability, control, and accountability in mind. Because moving forward with technology should also mean knowing that the foundations behind it are ready to support the business.",
    ost: "Confidence for Enterprise Operations.",
  },
  {
    id: "Scene09-BluForge",
    title: "BluForge",
    seconds: 25,
    vo: "Cyber threats don't stop. Neither should your defence. Meet BluForge, Quadra's Microsoft MISA-verified managed cyber-defence offering. Combining 24-by-7 security operations, intelligent threat detection, and coordinated incident response, BluForge brings visibility and accountability together. From identity to data, protecting the enterprise as one.",
    ost: "BluForge — One Unified Defence.",
  },
  {
    id: "Scene10-QuadraAIR",
    title: "Quadra AIR",
    seconds: 25,
    vo: "AI transformation doesn't happen by adding another tool. It happens by changing the way work gets done. Quadra AIR — AI-In-Residence — brings engineers directly into your enterprise. Working alongside your teams, we identify opportunities, redesign workflows, and build governed AI solutions for production. Real workflows. Real adoption. Real business outcomes.",
    ost: "Engineering AI Into the Business.",
  },
  {
    id: "Scene11-Story1",
    title: "Customer Impact — Story 1",
    seconds: 20,
    vo: "Across complex enterprise environments, disconnected systems can slow decisions and increase operational effort. Quadra brings cloud modernization, data foundations, and managed operations together. Helping teams reduce complexity, improve visibility, and create the foundation for faster, more informed decisions.",
    flow: ["Business Challenge", "Quadra Solution", "Outcome"],
  },
  {
    id: "Scene12-Story2",
    title: "Customer Impact — Story 2",
    seconds: 20,
    vo: "For organizations managing critical operations, security and business continuity cannot be an afterthought. Quadra combines proactive protection, continuous monitoring, and accountable managed services. Helping enterprises strengthen resilience, respond with confidence, and stay focused on what comes next.",
    flow: ["Business Challenge", "Security Solution", "Outcome"],
  },
  {
    id: "Scene13-CoE",
    title: "Experience Our CoE",
    seconds: 35,
    vo: "Innovation becomes meaningful when you can experience it. Welcome to the Quadra Centre of Excellence for Microsoft AI and Security. A space where ideas become live demonstrations, technology meets real business challenges, and teams come together to explore what's possible. Discover practical applications of AI. Experience modern security capabilities. Engage with our experts through workshops, conversations, and collaborative problem-solving. Because the best way to understand transformation is to see it in action.",
    ost: "Experience Innovation. Explore What's Possible.",
  },
  {
    id: "Scene14-People",
    title: "People Behind the Solutions",
    seconds: 20,
    vo: "Behind every solution is a team that understands the responsibility of making it work. Architects. Engineers. Security specialists. AI innovators. People who listen, collaborate, and remain accountable long after deployment. That's the strength behind Quadra.",
    ost: "Expertise That Delivers. People Who Stay Accountable.",
  },
  {
    id: "Scene15-Close",
    title: "Start a Conversation",
    seconds: 20,
    vo: "Every enterprise has an ambition worth building toward. Whether you're modernizing cloud, scaling AI, or strengthening security, the next step begins with a conversation. Let's architect what's next. Quadra. Architecting Ambition.",
    ost: "Architecting Ambition. Cloud. AI. Security. One Architect.",
  },
];

export const TOTAL_FRAMES = SCENES.reduce((t, s) => t + s.seconds * FPS, 0);
