import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AccentBar, BLUE, BrandGround, FONT, NAVY, Quadrants, SKY, WHITE, WordReveal, clamp, ease, useExit } from "./kit";

export type Shot = {
  s: number;
  t0: number;
  t1: number;
  kind: "clip" | "card" | "partners" | "words" | "bluforge" | "endLogo" | "endCard";
  // Footage shots: a pre-cut segment in public/qf/ (built by build-footage.cjs from the Quadra camera originals)
  src?: string;
  source?: string;
  in?: number;
  rate?: number;
  text?: string;
  sub?: string;
  num?: string;
  logo?: boolean;
  words?: string[];
  // Viewer guidance (see shot-annotations.cjs)
  kicker?: string;
  chips?: string[];
  logos?: string[];
  step?: number;
  brand?: string;
};

export type Chapter = { no: number; title: string; steps?: string[] };

// Animate "1,000+" from 0 up to its value, keeping the separator and suffix
const countUp = (value: string, p: number) => {
  const n = Number(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");
  return Math.round(n * p).toLocaleString("en-US") + suffix;
};

const LogoBug: React.FC = () => (
  <Img
    src={staticFile("brand/quadra-white.png")}
    style={{
      position: "absolute",
      top: 64,
      right: 80,
      width: 190,
      filter: "drop-shadow(0 2px 10px rgba(10,29,59,0.55))",
      opacity: interpolate(useCurrentFrame(), [0, 10], [0, 1], clamp),
    }}
  />
);

// Pills that pop in one after another
const Chips: React.FC<{ items: string[]; delay: number }> = ({ items, delay }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
      {items.map((c, i) => {
        const f = frame - delay - i * 7;
        return (
          <div
            key={c}
            style={{
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
              opacity: interpolate(f, [0, 8], [0, 1], clamp),
              scale: interpolate(f, [0, 14], [0.7, 1], { ...clamp, easing: ease }),
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: BLUE }} />
            {c}
          </div>
        );
      })}
    </div>
  );
};

// Lower-left block over footage: figure, headline, supporting line and chips on a navy wash
const LowerLeft: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const exit = useExit(12);
  const { text, num, kicker, chips } = shot;
  const big = Boolean(text && !num);
  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, rgba(10,29,59,0.86) 0%, rgba(10,29,59,0.6) 36%, rgba(10,29,59,0) 64%)`,
          opacity: interpolate(frame, [0, 14], [0, 1], clamp) * exit,
        }}
      />
      <div style={{ position: "absolute", left: 140, bottom: 150, width: 1100, display: "flex", flexDirection: "column", gap: 24, opacity: exit }}>
        <AccentBar delay={4} />
        {num ? (
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 0.95, color: WHITE, letterSpacing: "-0.01em" }}>
            {countUp(num, interpolate(frame, [6, 46], [0, 1], { ...clamp, easing: ease }))}
          </div>
        ) : null}
        {num && text ? <WordReveal text={text.toUpperCase()} size={56} weight={700} delay={16} color={SKY} style={{ letterSpacing: "0.12em" }} /> : null}
        {big ? <WordReveal text={text as string} size={84} delay={8} /> : null}
        {kicker ? <WordReveal text={kicker} size={big ? 46 : 64} weight={big ? 600 : 800} delay={big ? 22 : 8} stagger={3} color={big ? SKY : WHITE} /> : null}
        {chips ? <Chips items={chips} delay={big || kicker ? 24 : 10} /> : null}
      </div>
    </>
  );
};

// Where the viewer is: scene number and name, top left
const ChapterTag: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const exit = useExit(10);
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
        opacity: interpolate(frame, [2, 12], [0, 1], clamp) * exit,
        translate: `${interpolate(frame, [2, 18], [-30, 0], { ...clamp, easing: ease })}px 0px`,
      }}
    >
      <div style={{ width: 58, height: 58, borderRadius: 12, background: BLUE, color: WHITE, display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 28 }}>
        {String(chapter.no).padStart(2, "0")}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", textTransform: "uppercase", color: WHITE }}>
        {chapter.title}
      </div>
    </div>
  );
};

// Customer-story tracker: Challenge → Solution → Outcome with the current step filled
const StoryTracker: React.FC<{ steps: string[]; step: number }> = ({ steps, step }) => {
  const frame = useCurrentFrame();
  const exit = useExit(10);
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 80,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 10,
        borderRadius: 999,
        background: "rgba(10,29,59,0.78)",
        opacity: interpolate(frame, [4, 14], [0, 1], clamp) * exit,
      }}
    >
      {steps.map((label, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {i > 0 ? <div style={{ width: 40, height: 3, background: done || active ? SKY : "rgba(255,255,255,0.5)" }} /> : null}
            <div
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 32,
                color: active ? WHITE : NAVY,
                background: active ? BLUE : WHITE,
                opacity: active ? 1 : 0.85,
                boxShadow: active ? "0 0 0 6px rgba(31,111,235,0.3)" : "none",
                scale: active ? interpolate(frame, [6, 20], [0.85, 1], { ...clamp, easing: ease }) : 1,
              }}
            >
              {done ? "✓ " : ""}
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// White tile with one or more logos, lower right
const LogoTile: React.FC<{ logos: string[] }> = ({ logos }) => {
  const frame = useCurrentFrame();
  const exit = useExit(10);
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
        opacity: interpolate(frame, [8, 18], [0, 1], clamp) * exit,
        translate: `0px ${interpolate(frame, [8, 26], [40, 0], { ...clamp, easing: ease })}px`,
      }}
    >
      {logos.map((l) => (
        <Img key={l} src={staticFile(`brand/${l}`)} style={{ height: l === "bluforge-lockup.png" ? 120 : l === "microsoft.svg" ? 80 : 60, width: "auto" }} />
      ))}
    </div>
  );
};

export const ClipShot: React.FC<{ shot: Shot; index: number; chapter: Chapter }> = ({ shot, index, chapter }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Not cut yet (build-footage.cjs still running): hold on navy
  if (!shot.src) return <AbsoluteFill style={{ backgroundColor: NAVY }} />;

  // Alternate the camera move from shot to shot: push in, pull out, drift left, drift right
  const move = index % 4;
  const scale = interpolate(frame, [0, durationInFrames], move === 1 ? [1.12, 1.02] : [1.02, 1.12], clamp);
  const dx = move === 2 ? interpolate(frame, [0, durationInFrames], [30, -30]) : move === 3 ? interpolate(frame, [0, durationInFrames], [-30, 30]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <AbsoluteFill style={{ scale, translate: `${dx}px 0px` }}>
        <Video src={staticFile(shot.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.04) saturate(1.06)" }} />
      </AbsoluteFill>
      {/* Soft top shade keeps the logo readable on bright office footage */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,29,59,0.35) 0%, rgba(10,29,59,0) 22%)" }} />

      {shot.logo ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "rgba(10,29,59,0.45)" }}>
          <Img
            src={staticFile("brand/quadra-white.png")}
            style={{
              width: 720,
              clipPath: `inset(0 ${interpolate(frame, [10, 40], [100, 0], { ...clamp, easing: ease })}% 0 0)`,
              scale: interpolate(frame, [0, durationInFrames], [1.04, 1], clamp),
            }}
          />
          <div style={{ marginTop: 34 }}>
            <AccentBar delay={34} width={220} />
          </div>
        </AbsoluteFill>
      ) : (
        <>
          <LogoBug />
          <ChapterTag chapter={chapter} />
        </>
      )}
      {chapter.steps && shot.step ? <StoryTracker steps={chapter.steps} step={shot.step} /> : null}
      {shot.text || shot.kicker || shot.chips ? <LowerLeft shot={shot} /> : null}
      {shot.logos ? <LogoTile logos={shot.logos} /> : null}
    </AbsoluteFill>
  );
};

// Navy brand card: quadrant motif on the right, headline building in on the left
export const TitleCard: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const exit = useExit(8);
  if (shot.brand) {
    // Product introduction: the real logo wipes on, with the product's place in the story beneath it
    const light = shot.brand === "intellixperience.png";
    const icon = shot.brand === "quadra-air.png";
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <BrandGround light={light} />
        <Quadrants x={960} y={540} size={900} delay={0} opacity={light ? 0.1 : 0.16} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, opacity: exit }}>
          {icon ? (
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <div style={{ width: 170, height: 170, borderRadius: 36, background: WHITE, display: "grid", placeItems: "center", scale: interpolate(frame, [2, 22], [0.6, 1], { ...clamp, easing: ease }), opacity: interpolate(frame, [2, 10], [0, 1], clamp) }}>
                <Img src={staticFile("brand/quadra-air.png")} style={{ width: 120 }} />
              </div>
              <WordReveal text={shot.text ?? ""} size={130} delay={8} />
            </div>
          ) : (
            <Img
              src={staticFile(`brand/${shot.brand}`)}
              style={{ width: 1150, clipPath: `inset(0 ${interpolate(frame, [4, 30], [100, 0], { ...clamp, easing: ease })}% 0 0)` }}
            />
          )}
          <AccentBar delay={24} width={220} />
          {shot.sub ? <WordReveal text={shot.sub} size={56} weight={600} delay={28} color={light ? NAVY : SKY} /> : null}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <BrandGround />
      <Quadrants x={1480} y={540} size={560} delay={2} opacity={0.5} />
      <Quadrants x={1480} y={540} size={300} color={SKY} delay={10} opacity={0.35} />
      <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 1050, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30, opacity: exit }}>
        <AccentBar delay={2} />
        <WordReveal text={shot.text ?? ""} size={shot.text && shot.text.length > 24 ? 92 : 120} delay={6} />
        {shot.sub ? <WordReveal text={shot.sub} size={52} weight={500} delay={20} color={SKY} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// Partner names as tiles that rise in one after another
export const PartnersCard: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = useExit(8);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround light />
      <div style={{ display: "flex", gap: 48, opacity: exit }}>
        {["Microsoft Azure", "AWS", "Google Cloud"].map((name, i) => {
          const f = frame - 4 - i * 6;
          return (
            <div
              key={name}
              style={{
                width: 540,
                height: 220,
                borderRadius: 20,
                background: WHITE,
                boxShadow: "0 24px 60px rgba(10,29,59,0.14)",
                borderTop: `8px solid ${BLUE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 54,
                color: NAVY,
                opacity: interpolate(f, [0, 12], [0, 1], clamp),
                translate: `0px ${interpolate(f, [0, 20], [80, 0], { ...clamp, easing: ease })}px`,
              }}
            >
              {name === "Microsoft Azure" ? <Img src={staticFile("brand/microsoft.svg")} style={{ width: 56, height: 56 }} /> : null}
              {name}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Closing words land one at a time; the last one sits in a blue pill
export const WordsCard: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = useExit(8);
  const words = shot.words ?? [];
  const step = Math.floor((durationInFrames - 30) / words.length);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround />
      <Quadrants x={960} y={540} size={760} delay={0} opacity={0.18} />
      <div style={{ display: "flex", gap: 44, alignItems: "center", opacity: exit }}>
        {words.map((w, i) => {
          const f = frame - i * step;
          const last = i === words.length - 1;
          return (
            <div
              key={w}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 104,
                color: WHITE,
                padding: last ? "6px 40px 14px" : 0,
                borderRadius: 999,
                background: last ? BLUE : "transparent",
                opacity: interpolate(f, [0, 8], [0, 1], clamp),
                scale: interpolate(f, [0, 16], [1.35, 1], { ...clamp, easing: ease }),
                filter: `blur(${interpolate(f, [0, 10], [10, 0], clamp)}px)`,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const BluForgeCard: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const exit = useExit(8);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround light />
      <Quadrants x={960} y={540} size={820} delay={0} opacity={0.12} />
      {[0, 1].map((k) => {
        const f = frame - 10 - k * 12;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              width: 560,
              height: 560,
              borderRadius: "50%",
              border: `3px solid ${BLUE}`,
              opacity: interpolate(f, [0, 30], [0.6, 0], clamp),
              scale: interpolate(f, [0, 30], [0.8, 1.5], clamp),
            }}
          />
        );
      })}
      <Img
        src={staticFile("brand/bluforge-lockup.png")}
        style={{
          width: 500,
          borderRadius: 24,
          boxShadow: "0 30px 80px rgba(10,29,59,0.18)",
          opacity: interpolate(frame, [2, 14], [0, 1], clamp) * exit,
          scale: interpolate(frame, [2, 30], [0.85, 1], { ...clamp, easing: ease, output: "perceptual-scale" }),
          translate: `0px ${shot.sub ? -70 : 0}px`,
        }}
      />
      {shot.sub ? (
        <div style={{ position: "absolute", bottom: 150, opacity: exit }}>
          <WordReveal text={shot.sub} size={52} weight={700} delay={24} color={NAVY} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const EndLogo: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const exit = useExit(8);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround />
      <Quadrants x={960} y={540} size={900} delay={0} opacity={0.14} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44, opacity: exit }}>
        <Img src={staticFile("brand/quadra-white.png")} style={{ width: 820, clipPath: `inset(0 ${interpolate(frame, [4, 34], [100, 0], { ...clamp, easing: ease })}% 0 0)` }} />
        <AccentBar delay={30} width={260} />
        <WordReveal text={shot.text ?? ""} size={76} weight={700} delay={36} />
      </div>
    </AbsoluteFill>
  );
};

// Simple line icons for the contact card
const Icon: React.FC<{ type: "web" | "mail" }> = ({ type }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke={WHITE} strokeWidth="3">
    <circle cx="32" cy="32" r="30" fill={BLUE} stroke="none" />
    {type === "web" ? (
      <>
        <circle cx="32" cy="32" r="15" />
        <path d="M17 32h30M32 17c6 5 6 25 0 30M32 17c-6 5-6 25 0 30" />
      </>
    ) : (
      <>
        <rect x="17" y="21" width="30" height="22" rx="3" />
        <path d="M18 23l14 11 14-11" />
      </>
    )}
  </svg>
);

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 30, durationInFrames - 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: NAVY }}>
      <BrandGround />
      <div style={{ display: "flex", flexDirection: "column", gap: 40, opacity: out }}>
        {[
          ["web", "www.quadrasystems.net"],
          ["mail", "ai@quadrasystems.net"],
        ].map(([type, line], i) => (
          <div
            key={line}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 60,
              color: WHITE,
              opacity: interpolate(frame - i * 8, [0, 12], [0, 1], clamp),
              translate: `${interpolate(frame - i * 8, [0, 20], [-60, 0], { ...clamp, easing: ease })}px 0px`,
            }}
          >
            <Icon type={type as "web" | "mail"} />
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
