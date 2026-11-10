import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENES } from "./data";
import { BLUE, FONTS, NAVY, SKY } from "./Scene";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scene 15: minimal closing screen. Ends on navy so the loop back to Scene 1 (which fades up from navy) is seamless.
export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = SCENES[14];

  return (
    <AbsoluteFill
      name="Start a Conversation"
      style={{
        backgroundColor: NAVY,
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity: interpolate(frame, [0, 12, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], clamp),
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 120%, ${BLUE}66 0%, rgba(59,140,255,0.12) 45%, rgba(7,13,26,0) 70%)`,
          scale: interpolate(frame, [0, durationInFrames], [1, 1.08], clamp),
        }}
      />
      <Interactive.Div
        name="Logo"
        style={{
          fontFamily: FONTS.display,
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: 24,
          color: "white",
          opacity: interpolate(frame, [10, 40], [0, 1], clamp),
          scale: interpolate(frame, [10, 60], [0.92, 1], { ...clamp, easing: ease, output: "perceptual-scale" }),
        }}
      >
        QUADRA
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 84,
          color: "white",
          opacity: interpolate(frame, [2 * fps, 3 * fps], [0, 1], clamp),
        }}
      >
        Architecting Ambition.
      </Interactive.Div>
      <Interactive.Div
        name="Strapline"
        style={{
          fontFamily: FONTS.body,
          fontSize: 48,
          color: SKY,
          opacity: interpolate(frame, [3 * fps, 4 * fps], [0, 1], clamp),
        }}
      >
        Cloud. AI. Security. One Architect.
      </Interactive.Div>
      <Interactive.Div
        name="Contact"
        style={{
          marginTop: 40,
          display: "flex",
          gap: 80,
          fontFamily: FONTS.body,
          fontWeight: 500,
          fontSize: 44,
          color: "white",
          opacity: interpolate(frame, [5 * fps, 6 * fps], [0, 1], clamp),
        }}
      >
        <span>www.quadrasystems.net</span>
        <span>ai@quadrasystems.net</span>
      </Interactive.Div>
      <Interactive.Div
        name="Voiceover note"
        style={{
          position: "absolute",
          bottom: 100,
          left: 140,
          right: 140,
          textAlign: "center",
          fontFamily: FONTS.body,
          fontSize: 40,
          color: "rgba(255,255,255,0.7)",
          opacity: interpolate(frame, [1 * fps, 2 * fps, durationInFrames - 2 * fps, durationInFrames - fps], [0, 1, 1, 0], clamp),
        }}
      >
        {s.vo}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
