// QuadraIntro, rebuilt on the Office TV production pack (13 scenes, 5:00, voice: Hope).
// Same look and motion kit as the first QuadraIntro (src/intro): graded footage with a slow move, lower-left text,
// timed chips, logo tiles, glass UI flows on blurred footage, full-screen cards, quadrant wipes, whips and window insets.
// Every graphic lands on the spoken word: cue(scene, phrase) reads the voiceover timings.
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NAVY, clamp } from "../cine/kit";
import { Chip, FPS } from "../intro/plan";
import { LogoBug, LogoTile, LowerText, QuadrantWipe, WhipFlash, WindowInset } from "../intro/fx";
import { Air, BluForge, Checks, Counter, EndCard, Grid, Incident, LogoBuild, Partners, QBuild, SectionCard, Stamp, TrackerOverlay, Workflow } from "../intro/flows";
import { QrCode } from "../tv/graphics";
import { CertStack, Impact, ProductHero, SkyPlate, Trails } from "./enhance";
import { TV_SCENES } from "../tv/script";
import { VO, cue as c } from "../tv/vo";
import footageJson from "./footage.json";

const F = (t: number) => Math.round(t * FPS);
export const INTRO2_FRAMES = F(300);

type Shot = { id: string; from: number; to: number };
const FOOTAGE = footageJson as Shot[];

// Background music: the user's instrumental (videoplayback (2) - Instrumental.mp3), looped bar-aligned to 300 s.
// Internal temp track: the reference music is copyrighted, so a licensed track must replace it before the film is shown.
// The original score is kept as tv/music/score.mp3.
const MUSIC = "tv/music/score.mp3"; // reference-instrumental.wav not shipped (copyrighted)
const MIX = { open: 0.9, under: 0.33, ramp: 10 };

const SND = {
  whoosh: "https://remotion.media/whoosh.wav",
  whip: "https://remotion.media/whip.wav",
  click: "https://remotion.media/mouse-click.wav",
  ding: "https://remotion.media/ding.wav",
  lock: "https://remotion.media/switch.wav",
};

// Footage shot as in the first intro: alternating push / pull / drift, cool grade, top shade, logo
const Plate: React.FC<{ id: string; n: number; bug: boolean }> = ({ id, n, bug }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const move = n % 4;
  const scale = interpolate(frame, [0, d], move === 1 ? [1.08, 1.0] : [1.0, 1.08], clamp);
  const dx = move === 2 ? interpolate(frame, [0, d], [24, -24]) : move === 3 ? interpolate(frame, [0, d], [-24, 24]) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <AbsoluteFill style={{ scale, translate: `${dx}px 0px`, filter: "contrast(1.03) saturate(0.95) brightness(1.03)" }}>
        <Video src={staticFile(`tv/f/${id}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,29,59,0.3) 0%, rgba(10,29,59,0) 22%), rgba(120,170,255,0.05)" }} />
      {bug ? <LogoBug /> : null}
    </AbsoluteFill>
  );
};

// UI flows sit on the footage blurred behind them, like the first intro's UI shots
const Frost: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backdropFilter: "blur(16px) brightness(0.85)", opacity: interpolate(frame, [0, 8, d - 8, d], [0, 1, 1, 0], clamp) }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: interpolate(frame, [d - 8, d], [1, 0], clamp) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Timeline ----------
type Kind = "over" | "card" | "ui";
type Win = { a: number; b: number; name: string; kind: Kind; el: (t0: number) => React.ReactNode; inset?: boolean };
const W: Win[] = [];
const SFX: { at: number; src: string; vol: number }[] = [];
const sfx = (at: number, src: string, vol: number) => SFX.push({ at, src, vol });
const win = (a: number, b: number, name: string, kind: Kind, el: Win["el"], inset = false) => {
  W.push({ a, b, name, kind, el, inset });
  if (inset) sfx(a - 0.4, SND.whoosh, 0.25);
};
type Lower = { head?: string; headAt?: number; kicker?: string; kickerAt?: number; chips?: Chip[]; logos?: string[]; logosAt?: number };
const lower = (a: number, b: number, name: string, p: Lower) => {
  win(a, b, name, "over", (t0) => (
    <>
      <LowerText t0={t0} head={p.head} headAt={p.headAt} kicker={p.kicker} kickerAt={p.kickerAt} chips={p.chips} />
      {p.logos ? <LogoTile logos={p.logos} t0={t0} at={p.logosAt} /> : null}
    </>
  ));
  p.chips?.forEach(([, t]) => sfx(t, SND.click, 0.25));
};
const section = (a: number, b: number, text: string, fill: string) => {
  win(a, b, text, "card", () => <SectionCard text={text} fill={fill} />);
  sfx(a, SND.whip, 0.3);
};
const stamp = (a: number, b: number, text: string, at: number, opts: { shield?: boolean; step?: number; size?: number } = {}) => {
  win(a, b, text, "card", (t0) => <Stamp t0={t0} text={text} at={at} {...opts} />);
  sfx(at, SND.whip, 0.35);
};
const counter = (a: number, b: number, v: string, label: string, at: number, recapAt?: number) => {
  win(a, b, v, "over", (t0) => <Counter t0={t0} v={v} label={label} at={at} recapAt={recapAt} />);
  sfx(at + 1.3, SND.ding, 0.2);
};

// 1 · The Premise
win(0, 3.75, "Q mark build", "over", () => <QBuild />);
sfx(2.2, SND.lock, 0.3);
lower(3.75, c(1, "Powerful engines") - 0.15, "Premise", { kicker: "Technology capability compounds every quarter.", kickerAt: c(1, "Technology"), head: "Enterprise adoption doesn't.", headAt: c(1, "Enterprise adoption") });
lower(c(1, "Powerful engines") - 0.15, c(1, "Across cloud") - 0.15, "Engines", { kicker: "Powerful engines don't move enterprises.", kickerAt: c(1, "Powerful engines"), head: "Transmissions do.", headAt: c(1, "Transmissions do") });
lower(c(1, "Across cloud") - 0.15, 15.5, "Transmission", { kicker: "Quadra is the transmission", kickerAt: c(1, "Quadra is"), chips: [["Cloud", c(1, "cloud,")], ["AI", c(1, "AI and")], ["Security", c(1, "security,")]] });
section(15.5, 20, "Building the Intelligent Enterprise.", "tv/f/a05.mp4");

// 2 · Cloud
const ms = c(2, "Microsoft Frontier"), aws = c(2, "A-W-S Premier"), gcp = c(2, "Google Cloud Premier"), workload = c(2, "every workload"), maxit = c(2, "Max I-T");
lower(20, ms - 0.4, "Cloud", { kicker: "Cloud", head: "Three clouds. One architect." });
win(ms - 0.4, workload - 0.2, "Partners", "card", (t0) => <Partners t0={t0} at={[ms, aws, gcp]} items={[["Microsoft", "Frontier"], ["AWS", "Premier"], ["Google Cloud", "Premier"]]} />, true);
[ms, aws, gcp].forEach((t) => sfx(t, SND.click, 0.25));
lower(workload - 0.2, maxit - 0.3, "Every workload", { kicker: "Every workload lands on the right platform", kickerAt: workload, head: "On merit.", headAt: c(2, "on merit") });
lower(maxit - 0.3, 45, "Max-IT", { kicker: "AI-driven cloud operations and FinOps", head: "Quadra Max-IT", chips: [["Spend governed", c(2, "spend governed")], ["Environments tuned", c(2, "environments tuned")]] });

// 3 · AI
const users = c(3, "one hundred thousand"), intellient = c(3, "Intellient"), intellilink = c(3, "Intelli-Link"), iso = c(3, "One hundred per cent");
lower(45, users - 0.3, "AI", { kicker: "AI demonstrations are everywhere.", kickerAt: c(3, "A-I demonstrations"), head: "AI in production is rare.", headAt: c(3, "A-I in production") });
counter(users - 0.3, intellient - 0.3, "100,000+", "Daily users", users);
const intellientChips: Chip[] = [["Designs", c(3, "designs")], ["Orchestrates", c(3, "orchestrates")], ["Governs agents", c(3, "governs")]];
win(intellient - 0.3, intellilink - 0.3, "Intellient", "card", (t0) => <ProductHero t0={t0} src="tv/ui/intellient.mp4" logo="intellient-full-white.svg" chips={intellientChips} />, true);
intellientChips.forEach(([, t]) => sfx(t, SND.click, 0.25));
sfx(intellient, SND.ding, 0.25);
const linkChips: Chip[] = [["Natural language", c(3, "natural language")], ["Inside the tools teams use", c(3, "inside the tools")]];
win(intellilink - 0.3, iso - 0.3, "IntelliLink", "card", (t0) => <ProductHero t0={t0} src="tv/ui/intellilink.mp4" logo="intellilink-full-white.svg" chips={linkChips} />);
linkChips.forEach(([, t]) => sfx(t, SND.click, 0.25));
sfx(intellilink, SND.ding, 0.25);
lower(iso - 0.3, 75, "ISO 42001", { head: "100% proprietary.", chips: [["ISO/IEC 42001 certified", c(3, "I-S-O")]], logos: ["tuv-iso42001.png"], logosAt: c(3, "I-S-O") });

// 4 · Productivity and Security
const lifecycle = c(4, "the full Microsoft"), w = c(4, "Workspace"), td = c(4, "Threat Doctor"), dx = c(4, "Defend-X"), sccm = c(4, "S-C-C-M");
lower(75, c(4, "Modern work") - 0.3, "Lifecycle", { kicker: "From Copilot adoption to Sentinel operations", kickerAt: c(4, "From Copilot"), head: "The full Microsoft 365 lifecycle.", headAt: lifecycle, logos: ["m365.png", "copilot.png"], logosAt: lifecycle });
win(c(4, "Modern work") - 0.3, 96.4, "Quadra IP", "ui", (t0) => <Workflow t0={t0} at={[w, td, dx, sccm]} nodes={["Workspace MigrationX", "Threat Doctor", "DefendX", "SCCM InsightX"]} title="Quadra IP · Microsoft 365 lifecycle" />);
[w, td, dx].forEach((t) => sfx(t, SND.click, 0.3));
sfx(sccm, SND.ding, 0.25);
lower(96.4, 100, "One team", { head: "One accountable team." });

// 5 · BluForge
const neither = c(5, "Neither"), indep = c(5, "Quadra's managed"), t247 = c(5, "Twenty-four"), identity = c(5, "Identity");
stamp(100, neither - 0.1, "Cyber threats don't stop.", c(5, "Cyber"), { shield: true });
stamp(neither - 0.1, indep - 0.3, "Neither does BluForge.", neither);
win(indep - 0.3, t247 - 0.3, "BluForge", "card", (t0) => <BluForge t0={t0} at={indep + 0.4} />, true);
sfx(indep + 0.4, SND.ding, 0.25);
const sec = [t247, c(5, "threat hunting"), c(5, "automated response"), c(5, "Security Center")];
win(t247 - 0.3, identity - 0.3, "Security Center", "ui", (t0) => (
  <Incident t0={t0} at={sec} labels={["24×7 operations", "Threat hunting", "Responding", "Unified"]} steps={["24×7 operations", "AI-led threat hunting", "Automated response", "BluForge Security Center"]} idle="Monitoring" />
));
sec.slice(0, 3).forEach((t) => sfx(t, SND.click, 0.3));
sfx(sec[3], SND.ding, 0.28);
lower(identity - 0.3, 125, "Identity to data", { head: "Identity to data, defended as one.", logos: ["bluforge-lockup.png"], logosAt: identity + 0.8 });

// 6 · Five Vendors, One Architect
const signal = c(6, "every signal"), five = c(6, "Five leaders");
lower(125, signal - 0.2, "Five vendors", { kicker: "Beyond Microsoft", head: "Five vendors. One architect.", chips: [["Zscaler", c(6, "Zscaler")], ["CrowdStrike", c(6, "CrowdStrike")], ["Fortinet", c(6, "Fortinet")], ["Sophos", c(6, "Sophos")], ["Barracuda", c(6, "Barracuda")]] });
lower(signal - 0.2, five - 0.3, "One SLA", { kicker: "Every signal feeding BluForge", head: "Under one signed SLA.", headAt: c(6, "one signed"), logos: ["bluforge-lockup.png"], logosAt: signal });
// Over the live office footage (f04 / f05) rather than a plain navy card
win(five - 0.3, 145, "Five leaders", "card", (t0) => <Impact t0={t0} kicker="Zscaler · CrowdStrike · Fortinet · Sophos · Barracuda" lines={[["Five leaders.", five], ["One defence.", c(6, "One defence")], ["One accountability.", c(6, "One accountability")]]} />);
[five, c(6, "One defence"), c(6, "One accountability")].forEach((t) => sfx(t, SND.whip, 0.3));

// 7 · Foundation
const vm = c(7, "VMware"), builds = c(7, "Quadra builds");
lower(145, vm - 0.3, "Foundation", { kicker: "Foundation", head: "Not every workload belongs in the public cloud." });
lower(vm - 0.3, builds - 0.2, "Platforms", { kicker: "Across every estate", chips: [["VMware", vm], ["Citrix", c(7, "Citrix")], ["Omnissa", c(7, "Omnissa")], ["Commvault", c(7, "Commvault")], ["Veeam", c(7, "Veeam")]] });
lower(builds - 0.2, 165, "Doesn't blink", { kicker: "Private and hybrid, built by Quadra", head: "Infrastructure that doesn't blink.", headAt: c(7, "infrastructure that") });

// 8 · Operations
const est = [c(8, "Cloud, Microsoft"), c(8, "three-sixty-five"), c(8, "security and"), c(8, "on-premises")], proact = c(8, "Pro-Act");
lower(165, est[0] - 0.3, "Operations", { kicker: "Always on.", kickerAt: c(8, "Always on"), head: "Always accountable.", headAt: c(8, "Always accountable") });
win(est[0] - 0.3, proact - 0.3, "Estates", "ui", (t0) => <Checks t0={t0} at={est} title="Four managed estates · defined SLAs" rows={["Cloud", "Microsoft 365", "Security", "On-premises"]} done="SLA met" />);
est.forEach((t) => sfx(t, SND.ding, 0.18));
lower(proact - 0.3, 185, "ProAct+", { kicker: "Four estates, one contract", head: "Unified by ProAct+." });

// 9 · How We Engage
const steps = [c(9, "Diagnose"), c(9, "Architect."), c(9, "Operate")], air = c(9, "With Quadra Air"), rewire = c(9, "rewiring"), question = c(9, "If A-I existed");
lower(185, air - 0.3, "Engage", { kicker: "How we engage", head: "Every engagement, three steps." });
win(185.4, air - 0.3, "Tracker", "over", (t0) => <TrackerOverlay t0={t0} steps={["Diagnose", "Architect", "Operate"]} at={steps} />);
steps.forEach((t) => sfx(t, SND.ding, 0.2));
win(air - 0.3, rewire - 0.2, "Quadra AIR", "card", (t0) => <Air t0={t0} at={air + 0.2} />, true);
sfx(air + 0.2, SND.ding, 0.25);
lower(rewire - 0.2, question - 0.2, "Rewiring", { kicker: "Engineers inside your organisation", head: "Workflows rewired around AI." });
stamp(question - 0.2, 210, "If AI existed from the beginning, would you even do this task this way?", question, { step: 0.3, size: 104 });

// 10 · Experience Our CoE
const explore = c(10, "Explore"), because = c(10, "Because the best");
section(210, 214, "Experience Our CoE", "tv/f/j01.mp4");
lower(214, explore - 0.2, "CoE", { kicker: "Quadra Centre of Excellence for Microsoft AI and Security", head: "Ideas become live demonstrations.", logos: ["microsoft.svg"] });
lower(explore - 0.2, because - 0.2, "Explore", { kicker: "With our experts", chips: [["Practical AI", c(10, "practical")], ["Modern security", c(10, "modern security")], ["Real challenges", c(10, "real challenges")]] });
lower(because - 0.2, 235, "In action", { kicker: "The best way to understand transformation", head: "See it in action.", headAt: c(10, "see it") });
win(because + 0.2, because + 3.9, "Live demos", "over", () => <Grid shots={["tv/ui/intellient.mp4", "tv/ui/security.mp4", "tv/ui/intellilink.mp4"]} />);

// 11 · Why Quadra
const years = c(11, "Twenty-five years"), promise = c(11, "one promise"), awards = c(11, "Over one hundred"), certs = c(11, "More than one thousand"), cust = c(11, "Over three thousand");
section(235, years - 0.3, "Why Quadra", "tv/f/k01.mp4");
// Certifications on the softened award shelf; added before the counter so its blur sits under the "25 Years" text
win(years - 0.3, 243.3, "Certifications", "over", (t0) => <CertStack t0={t0} at={years + 0.5} />); // holds to the end of the award-shelf shot (k02)
sfx(years + 0.5, SND.ding, 0.22);
counter(years - 0.3, c(11, "Outcome-led") - 0.3, "25", "Years", years);
lower(c(11, "Outcome-led") - 0.3, promise - 0.2, "Principles", { kicker: "Four principles", chips: [["Outcome-led", c(11, "Outcome-led")], ["Vendor-agnostic", c(11, "Vendor-agnostic")], ["Senior leadership", c(11, "Senior leadership")], ["Local accountability", c(11, "Local accountability")]] });
lower(promise - 0.2, awards - 0.3, "Promise", { kicker: "One promise", head: "The people who scope your engagement are still running it." });
counter(awards - 0.3, certs - 0.3, "100+", "Awards", awards);
counter(certs - 0.3, cust - 0.3, "1,000+", "Certifications", certs);
counter(cust - 0.3, 265, "3,000+", "Customers", cust, cust + 2.4);

// 12 · Trusted by India's Most Ambitious Enterprises
const cities = c(12, "eight cities");
lower(265, cities - 0.3, "Trusted by", { kicker: "Today, Quadra is trusted by", head: "India's most ambitious enterprises.", chips: [["Leading banks", c(12, "leading banks")], ["Global pharma majors", c(12, "global pharmaceutical")], ["Iconic automakers", c(12, "iconic automakers")], ["Defence innovators", c(12, "defence innovators")]] });
lower(cities - 0.3, 285, "Eight cities", { kicker: "Teams across eight cities", chips: ["Mumbai", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Pune", "Cochin", "Coimbatore"].map((x, i) => [x, cities + 0.3 + i * 0.25] as Chip) });

// 13 · Your Ambition
const lets = c(13, "Let's architect"), sign = c(13, "Quadra. Architecting");
stamp(285, lets - 0.15, "What is your enterprise ambition?", c(13, "What is"));
// Outro: one continuous sky plate fades in over the question and carries the logo build and end card
win(lets - 0.55, 300, "Outro sky", "card", () => <SkyPlate />);
win(lets - 0.15, 295.5, "Logo build", "card", (t0) => <LogoBuild t0={t0} lock={sign} clear />);
[0, 1, 2, 3].forEach((k) => sfx(lets - 0.15 + (k * 10 + 10) / FPS, SND.lock, 0.22));
sfx(sign, SND.ding, 0.3);
win(295.5, 300, "End card", "card", () => <EndCard qr={<QrCode size={300} />} clear />);

// Scene changes get the quadrant wipe; every third footage cut inside a scene gets a foreground whip
const SCENE_STARTS = TV_SCENES.slice(1).map((s) => s.from);
SCENE_STARTS.forEach((t) => sfx(t - 0.3, SND.whoosh, 0.35));
const covered = (t: number) => W.some((x) => x.kind !== "over" && t > x.a - 0.3 && t < x.b + 0.3);
const WHIPS = FOOTAGE.slice(1)
  .map((s) => s.from)
  .filter((t, i) => i % 3 === 2 && !SCENE_STARTS.some((s) => Math.abs(s - t) < 0.8) && !covered(t));
WHIPS.forEach((t) => sfx(t - 0.15, SND.whip, 0.3));

// Launch-trail lift: the opening, every scene change, the celebratory counters, the cheering team and the logo lock
const TRAILS: { a: number; b: number; peak: number }[] = [
  { a: 0, b: 4.4, peak: 0.8 },
  ...SCENE_STARTS.map((t) => ({ a: t + 0.25, b: t + 1.6, peak: 0.45 })),
  { a: users, b: users + 2.6, peak: 0.6 },
  { a: awards, b: awards + 2.6, peak: 0.6 },
  { a: certs, b: certs + 2.4, peak: 0.6 },
  { a: cust, b: cust + 3, peak: 0.6 },
  { a: 268.5, b: 272.6, peak: 0.55 },
  { a: sign - 0.6, b: 295.5, peak: 0.5 },
];

const musicVolume = (f: number) => {
  let duck = 0;
  for (const v of VO) {
    const a = F(v.start), b = F(v.start + v.len), r = MIX.ramp;
    if (f >= a - r && f <= b + r) duck = Math.max(duck, interpolate(f, [a - r, a, b, b + r], [0, 1, 1, 0], clamp));
  }
  return MIX.open + (MIX.under - MIX.open) * duck;
};

const Layer: React.FC<{ x: Win }> = ({ x }) => (x.kind === "ui" ? <Frost>{x.el(x.a)}</Frost> : <>{x.el(x.a)}</>);

export const QuadraIntro2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    {FOOTAGE.map((s, i) => (
      <Sequence key={s.id} name={`${s.id} footage`} from={F(s.from)} durationInFrames={F(s.to) - F(s.from)} premountFor={45}>
        <Plate id={s.id} n={i + 1} bug={s.id !== "z01"} />
      </Sequence>
    ))}

    {W.map((x, i) => (
      <Sequence key={i} name={x.name} from={F(x.a)} durationInFrames={F(x.b) - F(x.a)} premountFor={45}>
        <Layer x={x} />
      </Sequence>
    ))}

    {/* Windows: the next card slides in as an inset and expands on the cut */}
    {W.filter((x) => x.inset).map((x, i) => (
      <Sequence key={`w${i}`} name="Window" from={F(x.a) - 12} durationInFrames={12}>
        <WindowInset>
          <AbsoluteFill style={{ backgroundColor: NAVY }}>
            <Layer x={x} />
          </AbsoluteFill>
        </WindowInset>
      </Sequence>
    ))}

    {TRAILS.map((x, i) => (
      <Sequence key={`t${i}`} name="Launch trails" from={F(x.a)} durationInFrames={F(x.b) - F(x.a)}>
        <Trails peak={x.peak} start={(i * 1.7) % 5.5} />
      </Sequence>
    ))}

    {WHIPS.map((t) => (
      <Sequence key={`p${t}`} name="Foreground wipe" from={F(t) - 5} durationInFrames={10}>
        <WhipFlash />
      </Sequence>
    ))}
    {SCENE_STARTS.map((t) => (
      <Sequence key={`q${t}`} name="Quadrant wipe" from={F(t) - 9} durationInFrames={18}>
        <QuadrantWipe />
      </Sequence>
    ))}

    {/* Voiceover (ElevenLabs, voice: Hope - upbeat and clear) */}
    {VO.map((v) => (
      <Sequence key={v.src} name={`Voiceover ${v.no}`} from={F(v.start)} durationInFrames={F(v.len + 0.4)} layout="none">
        <Audio src={staticFile(v.src)} />
      </Sequence>
    ))}
    <Audio src={staticFile(MUSIC)} volume={musicVolume} />
    {SFX.filter((s) => s.at >= 0).map((s, k) => (
      <Sequence key={k} name="SFX" from={F(s.at)} durationInFrames={45} layout="none">
        <Audio src={s.src} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
