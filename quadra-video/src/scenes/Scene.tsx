import { Video } from "@remotion/media";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSans";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SCENES } from "./data";

const { fontFamily: display } = loadArchivo("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadPlex("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const NAVY = "#070d1a";
export const BLUE = "#3b8cff";
export const SKY = "#7fb8ff";
export const FONTS = { display, body };

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Split the voiceover into sentences and give each a share of the scene by word count.
const captionTimeline = (vo: string, frames: number, fps: number) => {
  const lines = vo.split(/(?<=[.!?])\s+/);
  const counts = lines.map((l) => l.split(/\s+/).length);
  const total = counts.reduce((a, b) => a + b, 0);
  const lead = Math.round(0.4 * fps);
  const usable = frames - lead - Math.round(0.6 * fps);
  let at = lead;
  return lines.map((text, i) => {
    const len = Math.round((counts[i] / total) * usable);
    const item = { text, from: at, to: at + len };
    at += len;
    return item;
  });
};

export const Scene: React.FC<{ index: number }> = ({ index }) => {
  const s = SCENES[index];
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const shot = staticFile(`frames/frame-${String(index + 1).padStart(2, "0")}.jpg`);
  const captions = captionTimeline(s.vo, durationInFrames, fps);
  const split = Boolean(s.metrics);

  return (
    <AbsoluteFill
      name={s.title}
      style={{
        backgroundColor: NAVY,
        opacity: interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], clamp),
      }}
    >
      {/* Footage: stock clip when provided, otherwise the AI still with a slow push-in */}
      <AbsoluteFill style={{ overflow: "hidden", width: split ? "52%" : "100%" }}>
        {s.stock ? (
          <Video src={staticFile(s.stock)} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img
            src={shot}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: split ? "left center" : "center",
              scale: interpolate(frame, [0, durationInFrames], [1.02, 1.12], clamp),
            }}
          />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: split
            ? `linear-gradient(90deg, rgba(7,13,26,0) 30%, ${NAVY} 54%)`
            : "linear-gradient(to top, rgba(7,13,26,0.92) 0%, rgba(7,13,26,0.55) 38%, rgba(7,13,26,0) 65%)",
        }}
      />

      {s.metrics ? (
        <AbsoluteFill style={{ left: "54%", width: "46%", justifyContent: "flex-start", paddingTop: 110, paddingRight: 140, gap: 36 }}>
          <Interactive.Div
            name="Eyebrow"
            style={{ fontFamily: display, fontWeight: 700, fontSize: 44, color: SKY, letterSpacing: 4, textTransform: "uppercase" }}
          >
            {s.title}
          </Interactive.Div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "44px 60px" }}>
            {s.metrics.map(([value, label], i) => (
              <Interactive.Div
                key={label}
                name={`Metric ${label}`}
                style={{
                  borderTop: `3px solid ${BLUE}`,
                  paddingTop: 20,
                  opacity: interpolate(frame, [20 + i * 12, 45 + i * 12], [0, 1], clamp),
                  translate: interpolate(frame, [20 + i * 12, 45 + i * 12], ["0px 40px", "0px 0px"], { ...clamp, easing: ease }),
                }}
              >
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 110, color: "white", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: body, fontSize: 44, color: SKY, marginTop: 8 }}>{label}</div>
              </Interactive.Div>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {s.flow ? (
        <AbsoluteFill style={{ top: 100, height: "auto", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 28 }}>
          {s.flow.map((step, i) => (
            <Interactive.Div
              key={step}
              name={`Story ${step}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: interpolate(frame, [fps * (1 + i * 5), fps * (1.6 + i * 5)], [0, 1], clamp),
              }}
            >
              {i > 0 ? <span style={{ fontSize: 56, color: BLUE }}>→</span> : null}
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 700,
                  fontSize: 44,
                  color: "white",
                  padding: "14px 34px",
                  borderRadius: 999,
                  background: "rgba(7,13,26,0.75)",
                  border: `2px solid ${i === 2 ? BLUE : "rgba(127,184,255,0.45)"}`,
                }}
              >
                {step}
              </span>
            </Interactive.Div>
          ))}
        </AbsoluteFill>
      ) : null}

      {s.ost ? (
        <Interactive.Div
          name="On-screen text"
          style={{
            position: "absolute",
            left: 140,
            right: 140,
            bottom: 380,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1.05,
            color: "white",
            textWrap: "balance",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            opacity: interpolate(frame, [15, 40], [0, 1], clamp),
            translate: interpolate(frame, [15, 45], ["0px 50px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        >
          {s.ost}
        </Interactive.Div>
      ) : null}

      <Interactive.Div
        name="Wordmark"
        style={{
          position: "absolute",
          top: 70,
          left: 140,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 8,
          color: "white",
          opacity: interpolate(frame, [10, 30], [0, 0.9], clamp),
        }}
      >
        QUADRA
      </Interactive.Div>

      {/* Voiceover shown as captions until the recorded VO is added */}
      {captions.map((c) => (
        <Interactive.Div
          key={c.from}
          name="Caption"
          from={c.from}
          durationInFrames={c.to - c.from}
          style={{
            position: "absolute",
            left: split ? "54%" : 140,
            right: 140,
            bottom: 100,
            fontFamily: body,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: 1.3,
            color: "rgba(255,255,255,0.92)",
            textWrap: "pretty",
            borderLeft: `4px solid ${BLUE}`,
            paddingLeft: 28,
          }}
        >
          {c.text}
        </Interactive.Div>
      ))}
    </AbsoluteFill>
  );
};
