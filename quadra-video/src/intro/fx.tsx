// Motion kit for the Quadra intro: transitions, glass panels, timed chips and text blocks.
// Every state change follows anticipation -> action -> confirmation -> settle (storyboard Part 3).
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AccentBar, BLUE, FONT, NAVY, SKY, WHITE, WordReveal, clamp, ease, inOut } from "../cine/kit";
import { Chip, FPS } from "./plan";

export const OK = "#18a05e";
export const AMBER = "#e5a100";

// Frame within the current shot for an absolute time in the film
export const useLocal = (t0: number) => {
  const frame = useCurrentFrame();
  return (at: number) => frame - Math.round((at - t0) * FPS);
};

// Quadrant wipe: white sweeps clockwise around the centre to cover (frames 0-9), then sweeps on to reveal (9-18)
export const QuadrantWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const cover = interpolate(frame, [0, 9], [0, 360], { ...clamp, easing: inOut });
  const reveal = interpolate(frame, [9, 18], [0, 360], { ...clamp, easing: inOut });
  const bg =
    frame < 9
      ? `conic-gradient(from -90deg at 50% 50%, ${WHITE} 0deg ${cover}deg, transparent ${cover}deg 360deg)`
      : `conic-gradient(from -90deg at 50% 50%, transparent 0deg ${reveal}deg, ${WHITE} ${reveal}deg 360deg)`;
  const edge = frame < 9 ? cover : reveal;
  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* Blue leading edge, like the gap lines in the Quadra mark */}
      <div style={{ position: "absolute", left: 960, top: 540, width: 1400, height: 10, background: BLUE, transformOrigin: "0 50%", rotate: `${edge - 90}deg`, opacity: frame > 0 && frame < 18 ? 1 : 0 }} />
    </AbsoluteFill>
  );
};

// Fast streak used where the storyboard asks for a foreground wipe
export const WhipFlash: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 900,
          left: interpolate(frame, [0, 10], [-900, 1920], { ...clamp, easing: inOut }),
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.95) 45%, rgba(220,233,255,0.95) 55%, rgba(255,255,255,0))",
          filter: "blur(30px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const WhiteDip: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: WHITE, opacity: interpolate(frame, [0, 6, 12], [0, 1, 0], clamp) }} />;
};

// Window: the next shot appears as a rounded inset bottom-right (anticipation) and expands to full frame (action)
export const WindowInset: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const grow = interpolate(frame, [d - 5, d], [0, 1], { ...clamp, easing: ease });
  const scale = interpolate(frame, [0, 6], [0.2, 0.34], { ...clamp, easing: ease }) * (1 - grow) + grow;
  const x = interpolate(grow, [0, 1], [560, 0]);
  const y = interpolate(grow, [0, 1], [300, 0]);
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        scale,
        translate: `${x}px ${y}px`,
        borderRadius: interpolate(grow, [0, 1], [60, 0]),
        boxShadow: "0 40px 120px rgba(10,29,59,0.45)",
        border: `${interpolate(grow, [0, 1], [10, 0])}px solid ${WHITE}`,
        opacity: interpolate(frame, [0, 3], [0, 1], clamp),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Frosted panel for UI states
export const Glass: React.FC<{ children: React.ReactNode; width?: number; style?: React.CSSProperties }> = ({ children, width = 1000, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 36,
        padding: "48px 56px",
        boxShadow: "0 40px 100px rgba(10,29,59,0.35)",
        color: NAVY,
        fontFamily: FONT,
        opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        scale: interpolate(frame, [0, 4, 14], [0.94, 0.94, 1], { ...clamp, easing: ease }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Tick: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 44, color = OK }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill={color} opacity={Math.min(1, p * 3)} />
    <path d="M12 23 l7 7 l13 -15" fill="none" stroke={WHITE} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="34" strokeDashoffset={34 * (1 - p)} />
  </svg>
);

// Pulse ring that expands once on confirmation
export const Pulse: React.FC<{ f: number; size: number; color?: string }> = ({ f, size, color = BLUE }) =>
  f < 0 || f > 20 ? null : (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `4px solid ${color}`,
        opacity: interpolate(f, [0, 20], [0.8, 0], clamp),
        scale: interpolate(f, [0, 20], [1, 1.8], clamp),
      }}
    />
  );

// Chips that pop on their own times
export const TimedChips: React.FC<{ chips: Chip[]; t0: number }> = ({ chips, t0 }) => {
  const at = useLocal(t0);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
      {chips.map(([label, time]) => {
        const f = at(time);
        return (
          <div
            key={label}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 30px",
              borderRadius: 999,
              background: WHITE,
              color: NAVY,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 38,
              boxShadow: "0 12px 30px rgba(10,29,59,0.25)",
              opacity: interpolate(f, [-3, 4], [0, 1], clamp),
              scale: interpolate(f, [-3, 0, 8, 12], [0.6, 0.7, 1.05, 1], { ...clamp, easing: ease }),
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: BLUE, boxShadow: `0 0 0 ${interpolate(f, [8, 20], [0, 10], clamp)}px rgba(31,111,235,${interpolate(f, [8, 20], [0.4, 0], clamp)})` }} />
            {label}
          </div>
        );
      })}
    </div>
  );
};

// Lower-left block: headline and/or key line and chips on a navy wash
export const LowerText: React.FC<{ t0: number; head?: string; headAt?: number; kicker?: string; kickerAt?: number; chips?: Chip[] }> = ({ t0, head, headAt, kicker, kickerAt, chips }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const offset = (time: number | undefined) => (time ? Math.max(0, Math.round((time - t0) * FPS)) : 6);
  const kStart = offset(kickerAt);
  const hStart = offset(headAt);
  // When a headline follows a key line in the same shot, the key line hands over to it
  const showKicker = kicker && (!head || !headAt || frame < hStart);
  const showHead = head && (!headAt || frame >= hStart);
  const out = interpolate(frame, [d - 8, d], [1, 0], clamp);
  const wash = interpolate(frame, [0, 12], [0, 1], clamp) * out;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,29,59,0.85) 0%, rgba(10,29,59,0.55) 38%, rgba(10,29,59,0) 66%)", opacity: wash }} />
      <div style={{ position: "absolute", left: 140, bottom: 150, width: 1150, display: "flex", flexDirection: "column", gap: 24, opacity: out }}>
        <AccentBar delay={4} />
        {showKicker ? <WordReveal key="k" text={kicker as string} size={head ? 50 : 64} weight={head ? 600 : 800} delay={kStart} stagger={3} color={head ? SKY : WHITE} /> : null}
        {showHead ? <WordReveal key="h" text={head as string} size={86} delay={hStart} /> : null}
        {chips ? <TimedChips chips={chips} t0={t0} /> : null}
      </div>
    </>
  );
};

// Scene number and name, top-left
export const ChapterTag: React.FC<{ no: number; title: string }> = ({ no, title }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 80,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "8px 26px 8px 8px",
        borderRadius: 16,
        background: "rgba(10,29,59,0.78)",
        // Fades shrink on very short sequences (window insets are 12 frames) so the keyframes stay in order
        opacity: interpolate(frame, [0, Math.min(8, Math.floor(d / 3)), d - Math.min(6, Math.floor(d / 3)), d], [0, 1, 1, 0], clamp),
      }}
    >
      <div style={{ width: 58, height: 58, borderRadius: 12, background: BLUE, color: WHITE, display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 28 }}>{String(no).padStart(2, "0")}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", textTransform: "uppercase", color: WHITE }}>{title}</div>
    </div>
  );
};

export const LogoBug: React.FC = () => (
  <Img src={staticFile("brand/quadra-white.png")} style={{ position: "absolute", top: 64, right: 80, width: 190, filter: "drop-shadow(0 2px 10px rgba(10,29,59,0.55))" }} />
);

// White tile with logos, lower right, sliding up when the product or partner is named
export const LogoTile: React.FC<{ logos: string[]; t0: number; at?: number }> = ({ logos, t0, at }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const f = at ? local(at) : frame - 8;
  const { durationInFrames: d } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        bottom: 80,
        display: "flex",
        alignItems: "center",
        gap: 36,
        padding: "22px 34px",
        borderRadius: 18,
        background: WHITE,
        boxShadow: "0 18px 40px rgba(10,29,59,0.3)",
        opacity: interpolate(f, [0, 8], [0, 1], clamp) * interpolate(frame, [d - 8, d], [1, 0], clamp),
        translate: `0px ${interpolate(f, [0, 16], [40, 0], { ...clamp, easing: ease })}px`,
      }}
    >
      {logos.map((l) => (
        <Img key={l} src={staticFile(`brand/${l}`)} style={{ height: l === "bluforge-lockup.png" ? 120 : l === "microsoft.svg" ? 80 : 60, width: "auto" }} />
      ))}
    </div>
  );
};
