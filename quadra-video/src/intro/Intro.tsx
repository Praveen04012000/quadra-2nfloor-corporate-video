// Quadra corporate intro, built from the approved storyboard (storyboard-v3, 95 shots, 96 BPM grid).
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NAVY, clamp } from "../cine/kit";
import { VO_LINES } from "../cine/voiceoverTrack";
import { Glass, LogoBug, LogoTile, LowerText, QuadrantWipe, WhipFlash, WhiteDip, WindowInset } from "./fx";
import { Air, BluForge, Checks, Corners, Counter, Cta, Device, EndCard, Flip, Grid, Incident, LogoBuild, Partners, ProductCard, QBuild, Role, SectionCard, ShieldOverlay, Stamp, TrackerOverlay, Workflow } from "./flows";
import { BOARD, BoardShot, FPS, MUSIC, MUSIC_MIX, SHIELD, SPEC, TRACKERS, shotFile } from "./plan";

const F = (t: number) => Math.round(t * FPS);

// Footage shot: plate with a slow move, logo, chapter tag and the shot's overlays
const FootageShot: React.FC<{ n: number; shot: BoardShot }> = ({ n, shot }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const spec = SPEC[n] ?? {};
  const ui = shot.type === "ui";
  const move = n % 4;
  const scale = interpolate(frame, [0, d], move === 1 ? [1.08, 1.0] : [1.0, 1.08], clamp);
  const dx = move === 2 ? interpolate(frame, [0, d], [24, -24]) : move === 3 ? interpolate(frame, [0, d], [-24, 24]) : 0;
  const t0 = shot.t0;

  if (spec.device) return <Device src={shotFile(n)} logo={spec.device} />;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <AbsoluteFill style={{ scale, translate: `${dx}px 0px`, filter: ui ? "blur(16px) brightness(0.85)" : "contrast(1.03) saturate(0.95) brightness(1.03)" }}>
        <Video src={staticFile(shotFile(n))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* Cool, bright grade and a soft top shade for the logo */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,29,59,0.3) 0%, rgba(10,29,59,0) 22%), rgba(120,170,255,0.05)" }} />

      {spec.qbuild ? <QBuild /> : null}

      {spec.head || spec.kicker || spec.chips ? <LowerText t0={t0} head={spec.head} headAt={spec.headAt} kicker={spec.kicker} kickerAt={spec.kickerAt} chips={spec.chips} /> : null}
      {spec.num ? <Counter t0={t0} v={spec.num.v} label={spec.num.label} at={spec.num.at} recapAt={spec.recapAt} /> : null}
      {spec.logos ? <LogoTile logos={spec.logos} t0={t0} at={spec.logosAt} /> : null}
      {spec.role ? <Role text={spec.role.text} corner={spec.role.corner} /> : null}
      {spec.corners ? <Corners t0={t0} items={spec.corners} /> : null}
      {spec.grid ? <Grid shots={spec.grid} /> : null}

      {ui ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {spec.flip ? <Flip t0={t0} at={spec.flip} /> : null}
          {spec.checks ? <Checks t0={t0} at={spec.checks} /> : null}
          {spec.incident ? <Incident t0={t0} at={spec.incident} /> : null}
          {spec.workflow ? <Workflow t0={t0} at={spec.workflow} /> : null}
        </AbsoluteFill>
      ) : null}

      {/* Logo sits above every wash */}
      {spec.qbuild ? null : <LogoBug />}
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{ n: number }> = ({ n }) => {
  const shot = BOARD[n - 1];
  const spec = SPEC[n] ?? {};
  const t0 = shot.t0;
  if (shot.src) return <FootageShot n={n} shot={shot} />;
  if (spec.section) return <SectionCard text={spec.section.text} fill={spec.section.fill} />;
  if (spec.partners) return <Partners t0={t0} at={spec.partners} />;
  if (spec.product) return <ProductCard t0={t0} logo={spec.product.logo} at={spec.product.at} light={spec.product.light} />;
  if (spec.stamp) return <Stamp t0={t0} text={spec.stamp.text} at={spec.stamp.at} shield={spec.stamp.shield} />;
  if (spec.bluforge) return <BluForge t0={t0} at={spec.bluforge} />;
  if (spec.air) return <Air t0={t0} at={spec.air} />;
  if (spec.cta) return <Cta t0={t0} at={spec.cta} bg={shotFile(n - 1)} />;
  if (spec.logoBuild) return <LogoBuild t0={t0} lock={spec.logoBuild} />;
  if (spec.endCard) return <EndCard />;
  return <AbsoluteFill style={{ backgroundColor: NAVY }}><Glass>{shot.text}</Glass></AbsoluteFill>;
};

// ---------- Sound effects (Remotion's hosted library; rendering needs internet) ----------
type Sfx = { at: number; src: string; vol: number };
const SND = {
  whoosh: "https://remotion.media/whoosh.wav",
  whip: "https://remotion.media/whip.wav",
  click: "https://remotion.media/mouse-click.wav",
  ding: "https://remotion.media/ding.wav",
  lock: "https://remotion.media/switch.wav",
};

const buildSfx = (): Sfx[] => {
  const out: Sfx[] = [];
  const add = (at: number, src: string, vol: number) => out.push({ at, src, vol });
  BOARD.forEach((shot, i) => {
    const n = i + 1;
    const spec = SPEC[n] ?? {};
    const tr = shot.trans.toLowerCase();
    if (tr.includes("quadrant wipe")) add(shot.t1 - 0.3, SND.whoosh, 0.35);
    else if (tr.includes("foreground") || tr.includes("door")) add(shot.t1 - 0.15, SND.whip, 0.3);
    if (spec.windowNext) add(shot.t1 - 0.4, SND.whoosh, 0.25);
    spec.chips?.forEach(([, at]) => add(at, SND.click, 0.25));
    if (spec.flip) add(spec.flip, SND.ding, 0.22);
    if (spec.checks) [0, 1, 2].forEach((k) => add(spec.checks! + k * 0.7, SND.ding, 0.18));
    if (spec.incident) {
      spec.incident.slice(0, 3).forEach((t) => add(t, SND.click, 0.3));
      add(spec.incident[3], SND.ding, 0.28);
    }
    if (spec.workflow) {
      spec.workflow.slice(0, 3).forEach((t) => add(t, SND.click, 0.3));
      add(spec.workflow[3], SND.ding, 0.25);
    }
    if (spec.partners) spec.partners.forEach((t) => add(t, SND.click, 0.25));
    if (spec.num) add(spec.num.at + 1.3, SND.ding, 0.2);
    if (spec.product) add(spec.product.at, SND.ding, 0.25);
    if (spec.bluforge) add(spec.bluforge, SND.ding, 0.25);
    if (spec.air) add(spec.air, SND.ding, 0.25);
    if (spec.stamp) add(spec.stamp.at, SND.whip, 0.35);
    if (spec.role) add(shot.t0, SND.whip, 0.3);
    if (spec.corners) spec.corners.forEach(([, at]) => add(at, SND.whip, 0.25));
    if (spec.cta) add(spec.cta, SND.click, 0.4);
    if (spec.cta) add(spec.cta + 0.25, SND.ding, 0.3);
    if (spec.qbuild) add(2.2, SND.lock, 0.3);
    if (spec.logoBuild) {
      [0, 1, 2, 3].forEach((k) => add(shot.t0 + (k * 10 + 10) / FPS, SND.lock, 0.22));
      add(spec.logoBuild, SND.ding, 0.3);
    }
    if (spec.section) add(shot.t0, SND.whip, 0.3);
  });
  SHIELD.rings.forEach((t) => add(t, SND.lock, 0.28));
  add(SHIELD.done, SND.ding, 0.25);
  TRACKERS.forEach((t) => t.at.slice(1).forEach((a) => add(a, SND.ding, 0.2)));
  return out.filter((s) => s.at >= 0).sort((a, b) => a.at - b.at);
};
const SFX = buildSfx();

// Duck the music while the voiceover speaks: down ahead of each line, back up after it
const musicVolume = (f: number) => {
  const { open, underVoice, rampFrames: r } = MUSIC_MIX;
  let duck = 0;
  for (const v of VO_LINES) {
    const a = v.from, b = v.from + v.dur;
    if (f >= a - r && f <= b + r) {
      duck = Math.max(duck, interpolate(f, [a - r, a, b, b + r], [0, 1, 1, 0], clamp));
    }
  }
  return open + (underVoice - open) * duck;
};

export const QuadraIntro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    {BOARD.map((shot, i) => (
      <Sequence key={i} name={`${i + 1} · ${shot.src ?? shot.type}`} from={F(shot.t0)} durationInFrames={F(shot.t1) - F(shot.t0)} premountFor={45}>
        <ShotView n={i + 1} />
      </Sequence>
    ))}

    {/* Overlays that span several cuts */}
    <Sequence name="Shield" from={F(SHIELD.from)} durationInFrames={F(SHIELD.to) - F(SHIELD.from)}>
      <ShieldOverlay t0={SHIELD.from} rings={SHIELD.rings} scan={SHIELD.scan} done={SHIELD.done} />
    </Sequence>
    {TRACKERS.map((t) => (
      <Sequence key={t.from} name="Story tracker" from={F(t.from)} durationInFrames={F(t.to) - F(t.from)}>
        <TrackerOverlay t0={t.from} steps={t.steps} at={t.at} />
      </Sequence>
    ))}

    {/* Windows: the next shot slides in as an inset and expands on the cut */}
    {BOARD.map((shot, i) =>
      SPEC[i + 1]?.windowNext && i + 2 <= BOARD.length ? (
        <Sequence key={`w${i}`} name="Window" from={F(shot.t1) - 12} durationInFrames={12}>
          <WindowInset>
            <ShotView n={i + 2} />
          </WindowInset>
        </Sequence>
      ) : null,
    )}

    {/* Transitions at the storyboard's cut points */}
    {BOARD.map((shot, i) => {
      const tr = shot.trans.toLowerCase();
      if (i === BOARD.length - 1) return null;
      if (tr.includes("quadrant wipe"))
        return (
          <Sequence key={`t${i}`} name="Quadrant wipe" from={F(shot.t1) - 9} durationInFrames={18}>
            <QuadrantWipe />
          </Sequence>
        );
      if (tr.includes("foreground") || tr.includes("door") || tr.includes("partition"))
        return (
          <Sequence key={`t${i}`} name="Foreground wipe" from={F(shot.t1) - 5} durationInFrames={10}>
            <WhipFlash />
          </Sequence>
        );
      if (tr.includes("dip to white") || tr.includes("flash to white"))
        return (
          <Sequence key={`t${i}`} name="Dip" from={F(shot.t1) - 6} durationInFrames={12}>
            <WhiteDip />
          </Sequence>
        );
      return null;
    })}

    {/* Voiceover (ElevenLabs, voice: Hope) */}
    {VO_LINES.map((v) => (
      <Sequence key={v.src} name={`Voiceover ${v.scene}`} from={v.from} durationInFrames={v.dur} layout="none">
        <Audio src={staticFile(v.src)} />
      </Sequence>
    ))}

    {/* Music bed, ducked under the voiceover */}
    {MUSIC ? <Audio src={staticFile(MUSIC)} volume={musicVolume} /> : null}

    {SFX.map((s, k) => (
      <Sequence key={k} name="SFX" from={F(s.at)} durationInFrames={45} layout="none">
        <Audio src={s.src} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
