// Corporate-intro look: bright full-frame footage, Raleway type (Quadra's brand face), navy and blue brand graphics,
// word-by-word headline reveals and branded wipes between scenes.
import { loadFont } from "@remotion/google-fonts/Raleway";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });

export const FONT = fontFamily;
export const NAVY = "#0a1d3b";
export const NAVY_2 = "#123a73";
export const BLUE = "#1f6feb";
export const SKY = "#7fb8ff";
export const WHITE = "#ffffff";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fade out over the last few frames of the current sequence (short shots squeeze the fade)
export const useExit = (outF = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(outF, Math.floor(d / 4));
  return interpolate(frame, [d - o, d], [1, 0], clamp);
};

// Headline that rises word by word out of a mask
export const WordReveal: React.FC<{
  text: string;
  size: number;
  delay?: number;
  stagger?: number;
  weight?: number;
  color?: string;
  accentLast?: boolean;
  style?: React.CSSProperties;
}> = ({ text, size, delay = 0, stagger = 4, weight = 800, color = WHITE, accentLast = false, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.28, rowGap: size * 0.08, fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 1.08, color, ...style }}>
      {words.map((w, i) => {
        const f = frame - delay - i * stagger;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span
              style={{
                display: "inline-block",
                translate: `0px ${interpolate(f, [0, 18], [size * 1.1, 0], { ...clamp, easing: ease })}px`,
                color: accentLast && i === words.length - 1 ? SKY : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// Accent bar that draws from the left
export const AccentBar: React.FC<{ delay?: number; width?: number; color?: string }> = ({ delay = 0, width = 140, color = BLUE }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, height: 8, borderRadius: 4, background: color, transformOrigin: "left center", scale: `${interpolate(frame - delay, [0, 16], [0, 1], { ...clamp, easing: ease })} 1` }} />
  );
};

// Quadrant motif from the Quadra mark: four quarter-discs that rotate and settle into place
export const Quadrants: React.FC<{ x: number; y: number; size: number; color?: string; opacity?: number; delay?: number }> = ({
  x,
  y,
  size,
  color = BLUE,
  opacity = 0.35,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const r = size / 2;
  const radii = ["100% 0 0 0", "0 100% 0 0", "0 0 0 100%", "0 0 100% 0"];
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: size, height: size, rotate: `${interpolate(frame, [0, durationInFrames], [-8, 8])}deg` }}>
      {radii.map((br, i) => {
        const f = frame - delay - i * 5;
        const gx = i % 2 === 0 ? -1 : 1;
        const gy = i < 2 ? -1 : 1;
        const spread = interpolate(f, [0, 30], [r * 0.6, size * 0.03], { ...clamp, easing: ease });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i % 2 === 0 ? 0 : r,
              top: i < 2 ? 0 : r,
              width: r,
              height: r,
              borderRadius: br,
              background: color,
              opacity: interpolate(f, [0, 14], [0, opacity], clamp),
              translate: `${gx * spread}px ${gy * spread}px`,
            }}
          />
        );
      })}
    </div>
  );
};

// Ascent atmosphere: fine stars/motes rising slowly, with a faint launch-trail glow sweeping up through the frame
export const Starfield: React.FC<{ light?: boolean; count?: number }> = ({ light = false, count = 90 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const trail = interpolate(frame, [0, Math.max(60, d)], [-30, 130]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const x = random(`sx${i}`) * 1920;
        const speed = 0.25 + random(`sv${i}`) * 0.9;
        const y = (((random(`sy${i}`) * 1180 - frame * speed) % 1180) + 1180) % 1180 - 50;
        const size = 1.5 + random(`ss${i}`) * (light ? 5 : 3.2);
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(frame / (14 + random(`st${i}`) * 30) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: light ? "rgba(31,111,235,0.5)" : i % 7 === 0 ? "#ffd99a" : WHITE,
              opacity: (light ? 0.35 : 0.75) * tw,
              boxShadow: light ? undefined : `0 0 ${size * 3}px rgba(160,200,255,0.8)`,
            }}
          />
        );
      })}
      {/* Launch-trail glow: a soft diagonal band climbing from lower left to upper right */}
      <div
        style={{
          position: "absolute",
          left: "-20%",
          width: "140%",
          height: 260,
          top: `${100 - trail}%`,
          rotate: "-14deg",
          background: light
            ? "linear-gradient(90deg, rgba(127,184,255,0), rgba(127,184,255,0.18) 50%, rgba(127,184,255,0))"
            : "linear-gradient(90deg, rgba(127,184,255,0), rgba(127,184,255,0.16) 45%, rgba(255,217,154,0.12) 60%, rgba(127,184,255,0))",
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

// Branded gradient ground for title and logo cards
export const BrandGround: React.FC<{ light?: boolean }> = ({ light = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 6]);
  return (
    <AbsoluteFill
      style={{
        background: light
          ? `radial-gradient(90% 120% at ${70 + drift}% 50%, #e8f1ff 0%, #ffffff 60%)`
          : `radial-gradient(110% 130% at ${75 + drift}% 40%, ${NAVY_2} 0%, ${NAVY} 62%)`,
      }}
    >
      <Starfield light={light} count={light ? 40 : 90} />
    </AbsoluteFill>
  );
};

// Two-layer navy/blue panel that sweeps across a scene change
export const SceneWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = (lag: number, color: string) => (
    <AbsoluteFill
      style={{
        background: color,
        transform: `translateX(${interpolate(frame - lag, [0, 20], [-125, 125], { ...clamp, easing: inOut })}%) skewX(-12deg)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {panel(0, BLUE)}
      {panel(3, NAVY)}
    </AbsoluteFill>
  );
};
