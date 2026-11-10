// Office TV look, matched to the earlier Quadra intro: navy ground, Quadra blue, glass cards, Raleway throughout,
// light-blue-to-white headline gradient and the four-quarter motif from the Quadra mark. TV title-safe = inner 90%.
import { loadFont as loadRaleway } from "@remotion/google-fonts/Raleway";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { BrandGround, Quadrants } from "../cine/kit";

const { fontFamily: raleway } = loadRaleway("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

export const T = {
  bg: "#0a1d3b", // Quadra navy
  card: "rgba(18,58,115,0.78)", // glass
  border: "rgba(127,184,255,0.38)",
  orange: "#1f6feb", // accent (Quadra blue); name kept so every component switches with it
  gradA: "#7fb8ff",
  gradB: "#ffffff",
  white: "#FFFFFF",
  muted: "#b9c8e0",
  ok: "#3fcf8e",
  titleFont: raleway,
  textFont: raleway,
  safeX: 96, // 5% of 1920
  safeY: 54, // 5% of 1080
};

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const gradientText: React.CSSProperties = {
  background: `linear-gradient(90deg, ${T.gradA}, ${T.gradB})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// Fade in at `start`, out at the end of the sequence; safe on very short sequences
export const useFade = (start = 0, inF = 10, outF = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(outF, Math.floor(d / 4));
  const a = Math.min(start, d - o - 2);
  const b = Math.min(a + inF, d - o - 1);
  return interpolate(frame, [a, b, d - o, d], [0, 1, 1, 0], clamp);
};

// Navy brand ground with the quarter-disc motif, for full-screen cards
// Cards that use it carry className "tvcard"; TvFilm's style rule keeps their content above the ground.
export const Ground: React.FC<{ light?: boolean; motif?: boolean }> = ({ light = false, motif = true }) => (
  <AbsoluteFill className="tvground">
    <BrandGround light={light} />
    {motif ? <Quadrants x={1480} y={540} size={780} opacity={light ? 0.1 : 0.16} /> : null}
  </AbsoluteFill>
);

export const CardLayering: React.FC = () => <style>{".tvcard > *:not(.tvground) { position: relative; }"}</style>;

// Footage plate: navy grade and a slow camera move that alternates from shot to shot (push in, pull out, drift)
export const Plate: React.FC<{ id: string; darken?: number; blur?: number }> = ({ id, darken = 0.42, blur = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const move = [...id].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 4;
  const scale = interpolate(frame, [0, d], move === 1 ? [1.09, 1.0] : [1.0, 1.09], clamp);
  const dx = move === 2 ? interpolate(frame, [0, d], [28, -28]) : move === 3 ? interpolate(frame, [0, d], [-28, 28]) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <AbsoluteFill style={{ scale, translate: `${dx}px 0px`, filter: blur ? `blur(${blur}px) brightness(0.85)` : "contrast(1.04) saturate(1.05)" }}>
        <Video src={staticFile(`tv/f/${id}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(10,29,59,${Math.min(0.9, darken + 0.32)}) 0%, rgba(10,29,59,${darken}) 45%, rgba(10,29,59,${darken * 0.4}) 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,29,59,0.35) 0%, rgba(10,29,59,0) 22%)" }} />
    </AbsoluteFill>
  );
};

// Scene title: EB Garamond in the brand gradient, briefly at the start of each scene (pack: visitors can join the loop anywhere)
export const SceneTitle: React.FC<{ title: string; no: number; sub?: string[] }> = ({ title, no, sub }) => {
  const frame = useCurrentFrame();
  const o = useFade(0, 10, 12);
  return (
    <>
    {/* Soft backdrop so the title reads over busy footage on a TV */}
    <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(10,29,59,0.92) 0%, rgba(10,29,59,0.75) 45%, rgba(10,29,59,0) 80%)`, opacity: o }} />
    <div style={{ position: "absolute", left: T.safeX + 44, top: 330, opacity: o }}>
      <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 26, letterSpacing: "0.3em", color: T.orange, marginBottom: 10 }}>
        {String(no).padStart(2, "0")}
      </div>
      <div style={{ fontFamily: T.titleFont, fontWeight: 800, fontSize: 104, lineHeight: 1.05, maxWidth: 1300, ...gradientText, translate: `0px ${interpolate(frame, [0, 18], [24, 0], { ...clamp, easing: ease })}px` }}>
        {title}
      </div>
      <div style={{ width: interpolate(frame, [6, 24], [0, 180], { ...clamp, easing: ease }), height: 6, background: T.orange, marginTop: 22, borderRadius: 3 }} />
      {sub
        ? sub.map((l, i) => (
            <div key={i} style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 56, lineHeight: 1.25, color: T.white, marginTop: i ? 0 : 28, opacity: interpolate(frame - 10 - i * 4, [0, 10], [0, 1], clamp) }}>
              {l}
            </div>
          ))
        : null}
    </div>
    </>
  );
};

// Super: Raleway, up to two lines of six words or fewer, lower-left inside title-safe
export const Super: React.FC<{ lines: string[]; size?: number; top?: number }> = ({ lines, size = 60, top }) => {
  const frame = useCurrentFrame();
  const o = useFade(0, 10, 10);
  return (
    <>
    <AbsoluteFill style={{ background: `linear-gradient(20deg, rgba(10,29,59,0.9) 0%, rgba(10,29,59,0.6) 40%, rgba(10,29,59,0) 70%)`, opacity: o }} />
    <div style={{ position: "absolute", left: T.safeX + 44, ...(top !== undefined ? { top } : { bottom: T.safeY + 96 }), maxWidth: 1400, opacity: o }}>
      <div style={{ width: interpolate(frame, [0, 14], [0, 120], { ...clamp, easing: ease }), height: 6, background: T.orange, borderRadius: 3, marginBottom: 22 }} />
      {lines.map((l, i) => (
        <div key={i} style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: size, lineHeight: 1.2, color: T.white, translate: `0px ${interpolate(frame - i * 4, [0, 16], [size * 1.2, 0], { ...clamp, easing: ease })}px` }}>{l}</div>
        </div>
      ))}
    </div>
    </>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; lit?: boolean }> = ({ children, style, lit }) => (
  <div style={{ background: T.card, backdropFilter: "blur(14px)", border: `2px solid ${lit ? "#7fb8ff" : T.border}`, borderRadius: 22, boxShadow: lit ? `0 0 0 4px rgba(31,111,235,0.35), 0 24px 60px rgba(4,12,28,0.5)` : "0 24px 60px rgba(4,12,28,0.45)", color: T.white, fontFamily: T.textFont, ...style }}>
    {children}
  </div>
);

// Pop-in for a card that arrives at a local frame `f0`
export const usePop = (f0: number) => {
  const frame = useCurrentFrame();
  const f = frame - f0;
  return {
    f,
    style: {
      opacity: interpolate(f, [-2, 6], [0, 1], clamp),
      scale: interpolate(f, [-2, 8, 12], [0.9, 1.03, 1], clamp),
    } as React.CSSProperties,
  };
};

export const LogoBug: React.FC = () => (
  <Img src={staticFile("brand/quadra-white.png")} style={{ position: "absolute", top: T.safeY + 18, right: T.safeX + 20, width: 200, opacity: 0.92 }} />
);

export const Tick: React.FC<{ p: number; size?: number }> = ({ p, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill={T.orange} opacity={Math.min(1, p * 3)} />
    <path d="M12 23 l7 7 l13 -15" fill="none" stroke={T.white} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="34" strokeDashoffset={34 * (1 - p)} />
  </svg>
);
