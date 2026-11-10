// Review round 2 for QuadraIntro: full-screen product heroes, the office "Five leaders" moment, the ISO certification
// stack on the award shelf, and the launch-trail atmosphere (Higgsfield plates in public/hf/) for intro, peaks and outro.
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AccentBar, FONT, NAVY, Quadrants, SKY, Starfield, WHITE, clamp, ease } from "../cine/kit";
import { Pulse, TimedChips, useLocal } from "../intro/fx";
import { Chip } from "../intro/plan";

const outFade = (frame: number, d: number, n = 8) => interpolate(frame, [d - n, d], [1, 0], clamp);

// Product UI full frame with a slow push, black gradient at the bottom, full white logo and chips lower left
export const ProductHero: React.FC<{ t0: number; src: string; logo: string; chips: Chip[]; rate?: number }> = ({ t0, src, logo, chips, rate = 0.45 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const wipe = interpolate(frame, [6, 26], [100, 0], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: interpolate(frame, [0, d], [1.02, 1.1]), opacity: interpolate(frame, [0, 8], [0, 1], clamp) }}>
        <Video src={staticFile(src)} muted loop playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 24%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0) 62%)" }} />
      <div style={{ position: "absolute", left: 140, bottom: 120, display: "flex", flexDirection: "column", gap: 34, opacity: outFade(frame, d) }}>
        <AccentBar delay={4} width={180} />
        <div style={{ filter: `drop-shadow(0 0 ${interpolate(frame, [10, 22, 40], [0, 26, 0], clamp)}px rgba(90,162,255,0.85))` }}>
          <Img src={staticFile(`brand/${logo}`)} style={{ height: 120, clipPath: `inset(0 ${wipe}% 0 0)` }} />
        </div>
        <TimedChips t0={t0} chips={chips} />
      </div>
    </AbsoluteFill>
  );
};

// Impact lines over the live office footage: kicker, then one line per spoken beat, the last in the accent colour
export const Impact: React.FC<{ t0: number; kicker: string; lines: [string, number][] }> = ({ t0, kicker, lines }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const out = outFade(frame, d, 8);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,29,59,0.9) 0%, rgba(10,29,59,0.62) 42%, rgba(10,29,59,0.1) 75%), rgba(10,29,59,0.18)", opacity: interpolate(frame, [0, 10], [0, 1], clamp) * out }} />
      <Quadrants x={1640} y={540} size={620} opacity={0.14} delay={4} color={SKY} />
      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, opacity: out }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.18em", textTransform: "uppercase", color: SKY, marginBottom: 18, opacity: interpolate(frame, [4, 14], [0, 1], clamp) }}>{kicker}</div>
        {lines.map(([text, at], i) => {
          const f = local(at);
          const last = i === lines.length - 1;
          return (
            <div
              key={text}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: last ? 150 : 128,
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                color: last ? undefined : WHITE,
                background: last ? `linear-gradient(90deg, ${WHITE} 0%, ${SKY} 70%)` : undefined,
                backgroundClip: last ? "text" : undefined,
                WebkitBackgroundClip: last ? "text" : undefined,
                WebkitTextFillColor: last ? "transparent" : undefined,
                textShadow: last ? undefined : "0 6px 40px rgba(10,29,59,0.5)",
                opacity: interpolate(f, [-2, 3], [0, 1], clamp),
                translate: `${interpolate(f, [-2, 10], [-60, 0], { ...clamp, easing: ease })}px 0px`,
                filter: `blur(${interpolate(f, [-2, 5], [10, 0], clamp)}px)`,
              }}
            >
              {text}
            </div>
          );
        })}
        <div style={{ marginTop: 26 }}>
          <AccentBar delay={Math.max(0, frame - local(lines[lines.length - 1][1])) + 4} width={300} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Award shelf softened behind the certifications: ISO/IEC 42001 lands as the hero, ISO 9001 and ISO 27001 rise beneath it
export const CertStack: React.FC<{ t0: number; at: number }> = ({ t0, at }) => {
  const f = useLocal(t0)(at);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const out = outFade(frame, d, 10);
  const hero = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: ease });
  const support = (k: number) => interpolate(f - 22 - k * 7, [0, 18], [0, 1], { ...clamp, easing: ease });
  const label = (text: string, p: number, size: number) => (
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color: WHITE, letterSpacing: "0.04em", textAlign: "center", textShadow: "0 4px 20px rgba(10,29,59,0.7)", opacity: interpolate(p, [0.4, 1], [0, 1], clamp) }}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backdropFilter: "blur(7px) brightness(0.88)", opacity: interpolate(frame, [0, 12], [0, 1], clamp) * out }} />
      <AbsoluteFill style={{ background: "radial-gradient(45% 60% at 72% 48%, rgba(10,29,59,0.55) 0%, rgba(10,29,59,0) 100%)", opacity: interpolate(frame, [0, 12], [0, 1], clamp) * out }} />
      <div style={{ position: "absolute", left: 1080, width: 640, top: 90, display: "flex", flexDirection: "column", alignItems: "center", opacity: out }}>
        <div style={{ position: "relative", display: "grid", placeItems: "center", scale: interpolate(hero, [0, 1], [0.6, 1]), opacity: hero, filter: `drop-shadow(0 0 ${interpolate(f, [8, 18, 40], [0, 50, 18], clamp)}px rgba(127,184,255,0.9))` }}>
          <Img src={staticFile("brand/tuv-iso42001-v2.png")} style={{ width: 400 }} />
          <Pulse f={f - 12} size={430} color={SKY} />
        </div>
        <div style={{ marginTop: 20 }}>{label("ISO/IEC 42001 · AI Management", hero, 36)}</div>
        <div style={{ display: "flex", gap: 90, marginTop: 44 }}>
          {[
            ["tuv-iso9001.png", "ISO 9001"],
            ["tuv-iso27001.png", "ISO 27001"],
          ].map(([src, name], k) => {
            const p = support(k);
            return (
              <div key={src} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: p, translate: `0px ${interpolate(p, [0, 1], [180, 0])}px` }}>
                <Img src={staticFile(`brand/${src}`)} style={{ width: 200, filter: "drop-shadow(0 12px 30px rgba(10,29,59,0.5))" }} />
                {label(name, p, 28)}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Launch-trail light plate (Higgsfield, light on black) screen-blended over footage for lift on the peaks
export const Trails: React.FC<{ peak?: number; rate?: number; start?: number }> = ({ peak = 0.7, rate = 1, start = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const n = Math.min(14, Math.floor(d / 3));
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: interpolate(frame, [0, n, d - n, d], [0, peak, peak, 0], clamp), pointerEvents: "none" }}>
      <Video src={staticFile("hf/trails.mp4")} muted loop playbackRate={rate} trimBefore={Math.round(start * 30)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// Outro sky (Higgsfield): dawn horizon with a launch trail, kept dark under the logo build and end card
export const SkyPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <AbsoluteFill style={{ scale: interpolate(frame, [0, d], [1.0, 1.08]), opacity: interpolate(frame, [0, 12], [0, 1], clamp) }}>
        <Video src={staticFile("hf/sky.mp4")} muted loop playbackRate={0.75} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8) saturate(1.05)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(10,29,59,0.55) 0%, rgba(10,29,59,0.2) 70%, rgba(10,29,59,0.5) 100%)" }} />
      <Starfield count={60} />
    </AbsoluteFill>
  );
};
