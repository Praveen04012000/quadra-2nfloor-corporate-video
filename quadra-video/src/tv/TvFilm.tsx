// Quadra Office TV Intro Video (5:00, 13 scenes), built from the production pack of 26 Oct 2026.
// Master at 1920×1080, 25 fps; render with --scale=2 for the 3840×2160 TV file.
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import footageJson from "./footage.json";
import { TV_SCENES } from "./script";
import { CardLayering, Ground, LogoBug, Plate, SceneTitle, Super, T, clamp, ease, gradientText } from "./theme";
import { AmbitionQuestion, BluForgeHero, Cities, Counter, Device, EndCard, EngineCards, Estates, FourTiles, Industries, IpCard, IsoBadge, LogoReveal, PartnerBadges, PartnerRow, Principles, Quote, Routing, SecurityCenter, Stamp, Steps, VendorStream } from "./graphics";
import { F, VO, cue } from "./vo";
import { QuadrantWipe } from "../intro/fx";

// Original premium score composed for these 13 scenes (generate-tv-music.ts)
const MUSIC = "tv/music/score.mp3";

type Shot = { id: string; from: number; to: number };
const FOOTAGE = footageJson as Shot[];
export const TV_FRAMES = F(300);

// A window of the film [a, b) in absolute seconds; children see frames from 0 at `a`
const Win: React.FC<{ a: number; b: number; name: string; children: React.ReactNode }> = ({ a, b, name, children }) =>
  b - a < 0.2 ? null : (
    <Sequence name={name} from={F(a)} durationInFrames={F(b) - F(a)} premountFor={30}>
      {children}
    </Sequence>
  );

// Lines that land one at a time on their spoken cue (scene 6 sign-off)
const Triad: React.FC<{ base: number; items: [string, number][] }> = ({ base, items }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 10 }} className="tvcard"><Ground />
      {items.map(([t, at], i) => {
        const f = frame - Math.round((at - base) * 25);
        return (
          <div key={t} style={{ fontFamily: T.titleFont, fontWeight: 700, fontSize: 120, ...(i === items.length - 1 ? gradientText : { color: T.white }), opacity: interpolate(f, [-2, 4], [0, 1], clamp), scale: interpolate(f, [-2, 8], [1.3, 1], { ...clamp, easing: ease }) }}>
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string; top: number }> = ({ text, top }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, top, fontFamily: T.textFont, fontWeight: 700, fontSize: 40, color: T.white, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
      <span style={{ display: "inline-block", width: 60, height: 6, background: T.orange, borderRadius: 3, marginRight: 20, verticalAlign: "middle" }} />
      {text}
    </div>
  );
};

// Score level in gaps and under the voice (pack: duck 12-15 dB under the voiceover); tuned by measurement
const MIX = { open: 0.24, under: 0.06 };
const musicVolume = (f: number) => {
  let duck = 0;
  for (const v of VO) {
    const a = F(v.start), b = F(v.start + v.len);
    if (f >= a - 8 && f <= b + 8) duck = Math.max(duck, interpolate(f, [a - 8, a, b, b + 8], [0, 1, 1, 0], clamp));
  }
  return MIX.open + (MIX.under - MIX.open) * duck;
};

const SND = { whoosh: "https://remotion.media/whoosh.wav", click: "https://remotion.media/mouse-click.wav", ding: "https://remotion.media/ding.wav" };

export const TvFilm: React.FC = () => {
  const c = cue;
  const s = (n: number) => TV_SCENES[n - 1];
  const titleUntil = (n: number, next: number) => Math.min(s(n).from + 5, Math.max(s(n).from + 2.4, next - 0.3));

  // Cues used more than once
  const k = {
    engine: c(1, "Powerful engines"), trans: c(1, "Transmissions do"), outcomes: c(1, "business outcomes"),
    ms: c(2, "Microsoft Frontier"), aws: c(2, "A-W-S Premier"), gcp: c(2, "Google Cloud Premier"), workload: c(2, "every workload"), maxit: c(2, "Max I-T"),
    users: c(3, "one hundred thousand"), intellient: c(3, "Intellient"), intellilink: c(3, "Intelli-Link"), iso: c(3, "One hundred per cent"),
    lifecycle: c(4, "Modern work"), w: c(4, "Workspace"), td: c(4, "Threat Doctor"), dx: c(4, "Defend-X"), sccm: c(4, "S-C-C-M"),
    cyber: c(5, "Cyber"), neither: c(5, "Neither"), indep: c(5, "Quadra's managed"), t247: c(5, "Twenty-four"), hunt: c(5, "threat hunting"), resp: c(5, "automated response"), sc: c(5, "Security Center"), identity: c(5, "Identity"),
    zs: c(6, "Zscaler"), cs: c(6, "CrowdStrike"), ft: c(6, "Fortinet"), so: c(6, "Sophos"), bc: c(6, "Barracuda"), five: c(6, "Five leaders"), oneDef: c(6, "One defence"), oneAcc: c(6, "One accountability"),
    vm: c(7, "VMware"), ci: c(7, "Citrix"), om: c(7, "Omnissa"), cv: c(7, "Commvault"), ve: c(7, "Veeam"), builds: c(7, "Quadra builds"),
    estCloud: c(8, "Cloud, Microsoft"), est365: c(8, "three-sixty-five"), estSec: c(8, "security and"), estOnp: c(8, "on-premises"), proact: c(8, "Pro-Act"),
    diag: c(9, "Diagnose"), arch: c(9, "Architect."), oper: c(9, "Operate"), air: c(9, "With Quadra Air"), question: c(9, "If A-I existed"),
    years: c(11, "Twenty-five years"), fourP: c(11, "Four principles"), p1: c(11, "Outcome-led"), p2: c(11, "Vendor-agnostic"), p3: c(11, "Senior leadership"), p4: c(11, "Local accountability"), promise: c(11, "the people who"), awards: c(11, "Over one hundred"), certs: c(11, "More than one thousand"), cust: c(11, "Over three thousand"),
    banks: c(12, "leading banks"), pharma: c(12, "global pharmaceutical"), auto: c(12, "iconic automakers"), defence: c(12, "defence innovators"), cities: c(12, "eight cities"),
    lets: c(13, "Let's architect"), sign: c(13, "Quadra. Architecting"),
  };

  const sfx: [number, string, number][] = [
    ...TV_SCENES.slice(1).map((x) => [x.from - 0.2, SND.whoosh, 0.22] as [number, string, number]),
    ...[k.ms, k.aws, k.gcp, k.w, k.td, k.dx, k.sccm, k.zs, k.cs, k.ft, k.so, k.bc, k.vm, k.ci, k.om, k.cv, k.ve, k.estCloud, k.est365, k.estSec, k.estOnp, k.diag, k.arch, k.oper, k.p1, k.p2, k.p3, k.p4, k.banks, k.pharma, k.auto, k.defence].map((t) => [t, SND.click, 0.18] as [number, string, number]),
    ...[k.maxit, k.intellient, k.intellilink, k.iso, k.indep, k.sc, k.proact, k.air, k.users + 1.3, k.awards + 1.3, k.certs + 1.3, k.cust + 1.3, k.sign].map((t) => [t, SND.ding, 0.2] as [number, string, number]),
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <CardLayering />
      {/* Footage plates */}
      {FOOTAGE.map((f) => (
        <Win key={f.id} a={f.from} b={f.to} name={`footage ${f.id}`}>
          <Plate id={f.id} darken={0.5} />
        </Win>
      ))}

      {/* 1 · The Premise */}
      <Win a={0} b={3} name="Logo reveal"><LogoReveal /></Win>
      <Win a={3.4} b={k.engine - 0.3} name="Super"><Super lines={["Building the", "Intelligent Enterprise."]} /></Win>
      <Win a={k.engine - 0.3} b={20} name="Engine → Transmission → Outcomes"><EngineCards base={k.engine - 0.3} at={[k.engine, k.trans, k.outcomes]} /></Win>

      {/* 2 · Cloud */}
      <Win a={20} b={titleUntil(2, k.ms)} name="Title"><SceneTitle no={2} title="Cloud" sub={["Three clouds. One architect."]} /></Win>
      <Win a={k.ms - 0.3} b={k.workload - 0.2} name="Partner badges"><PartnerBadges base={k.ms - 0.3} at={[k.ms, k.aws, k.gcp]} /></Win>
      <Win a={k.workload - 0.2} b={k.maxit - 0.3} name="Routing"><Routing base={k.workload - 0.2} at={k.workload} /></Win>
      <Win a={k.maxit - 0.3} b={45} name="Max-IT"><IpCard base={k.maxit - 0.3} at={k.maxit} kicker="Cloud operations" name="Quadra Max-IT" line="AI-driven cloud operations and FinOps" /></Win>

      {/* 3 · AI */}
      <Win a={45} b={titleUntil(3, k.users)} name="Title"><SceneTitle no={3} title="AI" sub={["AI built by us.", "Run by your enterprise."]} /></Win>
      <Win a={k.users - 0.3} b={k.intellient - 0.3} name="100,000+"><Counter base={k.users - 0.3} at={k.users} value="100,000+" label="Daily users in production" /></Win>
      <Win a={k.intellient - 0.3} b={k.intellilink - 0.3} name="Intellient">
        <Device ui="tv/ui/intellient.mp4" />
        <IpCard base={k.intellient - 0.3} at={k.intellient} icon="tv/brand/intellient.png" kicker="Agentic AI platform" name="Intellient" line="Designs, orchestrates and governs agents" y={620} width={820} />
      </Win>
      <Win a={k.intellilink - 0.3} b={k.iso - 0.3} name="IntelliLink">
        <Device ui="tv/ui/intellilink.mp4" />
        <IpCard base={k.intellilink - 0.3} at={k.intellilink} icon="tv/brand/intellilink.png" kicker="Enterprise data" name="IntelliLink" line="Natural language, inside existing tools" y={620} width={820} />
      </Win>
      <Win a={k.iso - 0.3} b={75} name="ISO/IEC 42001"><IsoBadge base={k.iso - 0.3} at={k.iso} /></Win>

      {/* 4 · Productivity and Security */}
      <Win a={75} b={titleUntil(4, k.lifecycle)} name="Title"><SceneTitle no={4} title="Productivity and Security" sub={["The full Microsoft 365 lifecycle,", "under one accountable team"]} /></Win>
      <Win a={k.lifecycle - 0.5} b={100} name="Four tiles"><FourTiles base={k.lifecycle - 0.5} at={[k.w, k.td, k.dx, k.sccm]} /></Win>

      {/* 5 · BluForge */}
      <Win a={100} b={k.neither - 0.1} name="Stamp"><Stamp base={100} at={k.cyber} text="Cyber threats don't stop." /></Win>
      <Win a={k.neither - 0.1} b={k.indep - 0.3} name="Stamp"><Stamp base={k.neither - 0.1} at={k.neither} text="Neither does BluForge." /></Win>
      <Win a={k.indep - 0.3} b={k.t247 - 0.3} name="BluForge"><BluForgeHero base={k.indep - 0.3} at={k.indep + 1.2} /></Win>
      <Win a={k.t247 - 0.3} b={k.identity - 0.3} name="Security Center"><SecurityCenter base={k.t247 - 0.3} at={[k.t247, k.hunt, k.resp, k.sc]} /></Win>
      <Win a={k.identity - 0.3} b={125} name="Super"><Super lines={["Identity to data,", "defended as one."]} /></Win>

      {/* 6 · Five Vendors, One Architect */}
      <Win a={125} b={titleUntil(6, k.zs)} name="Title"><SceneTitle no={6} title="Five Vendors, One Architect" /></Win>
      <Win a={k.zs - 0.3} b={k.five - 0.3} name="Vendor stream"><VendorStream base={k.zs - 0.3} at={[k.zs, k.cs, k.ft, k.so, k.bc]} /></Win>
      <Win a={k.five - 0.3} b={145} name="Five leaders"><Triad base={k.five - 0.3} items={[["Five leaders.", k.five], ["One defence.", k.oneDef], ["One accountability.", k.oneAcc]]} /></Win>

      {/* 7 · Foundation */}
      <Win a={145} b={titleUntil(7, k.vm)} name="Title"><SceneTitle no={7} title="Foundation" /></Win>
      <Win a={k.vm - 0.3} b={k.builds - 0.3} name="Partner row"><PartnerRow base={k.vm - 0.3} at={[k.vm, k.ci, k.om, k.cv, k.ve]} names={["VMware", "Citrix", "Omnissa", "Commvault", "Veeam"]} /></Win>
      <Win a={k.builds - 0.3} b={165} name="Super"><Super lines={["The infrastructure", "that doesn't blink."]} /></Win>

      {/* 8 · Operations */}
      <Win a={165} b={titleUntil(8, k.estCloud)} name="Title"><SceneTitle no={8} title="Operations" sub={["Always on. Always accountable."]} /></Win>
      <Win a={k.estCloud - 0.3} b={185} name="Estates">
        <Estates base={k.estCloud - 0.3} at={[k.estCloud, k.est365, k.estSec, k.estOnp]} bar={k.proact} />
      </Win>
      <Win a={k.proact + 0.4} b={185} name="Super"><Super lines={["Four estates, one contract,", "unified by ProAct+."]} size={54} /></Win>

      {/* 9 · How We Engage */}
      <Win a={185} b={titleUntil(9, k.diag)} name="Title"><SceneTitle no={9} title="How We Engage" /></Win>
      <Win a={k.diag - 0.3} b={k.air - 0.3} name="Steps"><Steps base={k.diag - 0.3} at={[k.diag, k.arch, k.oper]} /></Win>
      <Win a={k.air - 0.3} b={k.question - 0.3} name="Quadra AIR"><IpCard base={k.air - 0.3} at={k.air} icon="tv/brand/quadra-air.png" kicker="AI-In-Residence" name="Quadra AIR" line="Engineers inside your organisation" width={900} /></Win>
      <Win a={k.question - 0.3} b={210} name="AIR question"><Quote text="If AI existed from the beginning, would you even do this task this way?" /></Win>

      {/* 10 · Experience Our CoE */}
      <Win a={210} b={217} name="Title"><SceneTitle no={10} title="Experience Our CoE" sub={["Quadra Centre of Excellence", "for Microsoft AI and Security"]} /></Win>

      {/* 11 · Why Quadra */}
      <Win a={235} b={k.years - 0.3} name="Title"><SceneTitle no={11} title="Why Quadra" /></Win>
      <Win a={k.years - 0.3} b={k.fourP - 0.3} name="25 years"><Counter base={k.years - 0.3} at={k.years} value="25" label="Years" /></Win>
      <Win a={k.fourP - 0.3} b={k.promise - 0.3} name="Principles">
        <Label text="Four principles" top={160} />
        <Principles base={k.fourP - 0.3} at={[k.p1, k.p2, k.p3, k.p4]} />
      </Win>
      <Win a={k.promise - 0.3} b={k.awards - 0.3} name="Promise"><Super lines={["The people who scope your engagement", "are still running it."]} size={56} /></Win>
      <Win a={k.awards - 0.3} b={k.certs - 0.3} name="100+ awards"><Counter base={k.awards - 0.3} at={k.awards} value="100+" label="Awards" sub="20 consecutive years of global award recognition" /></Win>
      <Win a={k.certs - 0.3} b={k.cust - 0.3} name="1,000+"><Counter base={k.certs - 0.3} at={k.certs} value="1,000+" label="Certifications" /></Win>
      <Win a={k.cust - 0.3} b={265} name="3,000+"><Counter base={k.cust - 0.3} at={k.cust} value="3,000+" label="Customers" /></Win>

      {/* 12 · Trusted by */}
      <Win a={265} b={titleUntil(12, k.banks)} name="Title"><SceneTitle no={12} title="Trusted by India's most ambitious enterprises" /></Win>
      <Win a={titleUntil(12, k.banks)} b={k.cities - 0.6} name="Industries">
        <Label text="Trusted by India's most ambitious enterprises" top={300} />
        <Industries base={titleUntil(12, k.banks)} at={[k.banks, k.pharma, k.auto, k.defence]} />
      </Win>
      <Win a={k.cities - 0.6} b={285} name="Eight cities">
        <Label text="Teams across eight cities" top={360} />
        <Cities base={k.cities - 0.6} at={k.cities - 0.4} />
      </Win>

      {/* 13 · Your Ambition */}
      <Win a={285} b={k.lets - 0.2} name="Question"><AmbitionQuestion /></Win>
      <Win a={k.lets - 0.2} b={300} name="End card"><EndCard base={k.lets - 0.2} logoAt={k.sign} contactAt={293} /></Win>

      {/* Logo bug 0:20 to 4:45 */}
      <Win a={20} b={285} name="Logo bug"><LogoBug /></Win>

      {/* Quadrant wipe (white quarter-sweep from the Quadra mark) centred on every scene change */}
      {TV_SCENES.slice(1).map((x) => (
        <Win key={x.no} a={x.from - 0.36} b={x.from + 0.36} name="Quadrant wipe"><QuadrantWipe /></Win>
      ))}

      {/* Voiceover (ElevenLabs, voice: Monika Sogam) */}
      {VO.map((v) => (
        <Sequence key={v.src} name={`VO ${v.no}`} from={F(v.start)} durationInFrames={F(v.len + 0.4)} layout="none">
          <Audio src={staticFile(v.src)} />
        </Sequence>
      ))}
      {MUSIC ? <Audio src={staticFile(MUSIC)} volume={musicVolume} /> : null}
      {sfx.map(([t, src, vol], i) => (
        <Sequence key={i} name="SFX" from={F(t)} durationInFrames={40} layout="none">
          <Audio src={src} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
