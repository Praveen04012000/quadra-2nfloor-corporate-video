// Cards and transaction flows for the Quadra intro (storyboard Part 3).
// Each flow: anticipation (glow / outline), action (move, fill, press), confirmation (tick, pulse), settle (hold).
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AccentBar, BLUE, BrandGround, FONT, NAVY, Quadrants, SKY, WHITE, WordReveal, clamp, ease } from "../cine/kit";
import { AMBER, Glass, OK, Pulse, Tick, useLocal } from "./fx";
import { shotFile } from "./plan";

const outFade = (frame: number, d: number, n = 8) => interpolate(frame, [d - n, d], [1, 0], clamp);

// ---------- Quadra mark from four quarter-discs ----------
const Quarters: React.FC<{ size: number; spread: number[]; offset: [number, number][]; opacity?: number; color?: string }> = ({ size, spread, offset, opacity = 1, color = WHITE }) => {
  const r = size / 2;
  const radii = ["100% 0 0 0", "0 100% 0 0", "0 0 0 100%", "0 0 100% 0"];
  return (
    <div style={{ position: "relative", width: size, height: size, opacity }}>
      {radii.map((br, i) => {
        const gx = i % 2 === 0 ? -1 : 1;
        const gy = i < 2 ? -1 : 1;
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
              translate: `${gx * spread[i] + offset[i][0]}px ${gy * spread[i] + offset[i][1]}px`,
            }}
          />
        );
      })}
    </div>
  );
};

// 1.1: the Q mark assembles on the building, then the full logo resolves
export const QBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const start: [number, number][] = [[-900, -500], [900, -500], [-900, 500], [900, 500]];
  const offset = start.map(([x, y], i) => {
    const p = interpolate(frame, [14 + i * 6, 44 + i * 6], [0, 1], { ...clamp, easing: ease });
    return [x * (1 - p), y * (1 - p)] as [number, number];
  });
  const spread = [0, 1, 2, 3].map((i) => interpolate(frame, [44 + i * 6, 52 + i * 6, 62 + i * 6], [8, 3, 6], clamp));
  const logo = interpolate(frame, [70, 92], [0, 100], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: `rgba(10,29,59,${interpolate(frame, [0, 30], [0, 0.35], clamp)})` }}>
      <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
        <div style={{ opacity: interpolate(frame, [70, 84], [1, 0], clamp), scale: interpolate(frame, [60, 72], [1, 0.97], clamp) }}>
          <Quarters size={260} spread={spread} offset={offset} />
          <Pulse f={frame - 66} size={300} color={WHITE} />
        </div>
        <Img src={staticFile("brand/quadra-white.png")} style={{ position: "absolute", width: 820, clipPath: `inset(0 ${100 - logo}% 0 0)` }} />
      </div>
    </AbsoluteFill>
  );
};

// 15.4: quarter-discs drop in on the beat and lock into the Q mark, then the logo, tagline and strapline
export const LogoBuild: React.FC<{ t0: number; lock: number; clear?: boolean }> = ({ t0, lock, clear }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const lockF = Math.round((lock - t0) * 30);
  const offset = [0, 1, 2, 3].map((i) => {
    const s = i * 10;
    const y = interpolate(frame, [s, s + 10, s + 15, s + 19], [-900, 0, -40, 0], { ...clamp, easing: ease });
    return [0, y] as [number, number];
  });
  const spread = [0, 1, 2, 3].map(() => interpolate(frame, [lockF - 4, lockF, lockF + 6], [16, 2, 7], clamp));
  const swap = interpolate(frame, [lockF + 10, lockF + 26], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: clear ? undefined : `linear-gradient(135deg, ${BLUE}, #0f4fc2)` }}>
      <Quadrants x={960} y={540} size={1100} opacity={0.1} color={WHITE} />
      <div style={{ position: "absolute", opacity: 1 - swap }}>
        <Quarters size={300} spread={spread} offset={offset} />
        <Pulse f={frame - lockF} size={340} color={WHITE} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, opacity: swap * outFade(frame, d, 6) }}>
        <Img src={staticFile("brand/quadra-white.png")} style={{ width: 860, clipPath: `inset(0 ${interpolate(frame, [lockF + 10, lockF + 34], [100, 0], { ...clamp, easing: ease })}% 0 0)` }} />
        <WordReveal text="Architecting Ambition." size={78} weight={700} delay={lockF + 34} />
        <WordReveal text="Cloud. AI. Security. One Architect." size={46} weight={600} delay={lockF + 46} color="#dce9ff" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Section card: white card, live footage visible inside the letters ----------
export const SectionCard: React.FC<{ text: string; fill: number | string }> = ({ text, fill }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: interpolate(frame, [0, 120], [1.1, 1.0], clamp) }}>
        <Video src={staticFile(typeof fill === "string" ? fill : shotFile(fill))} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.62) saturate(1.25) contrast(1.1)" }} />
      </AbsoluteFill>
      {/* Screen blend: white hides the footage, black letters let it through */}
      <AbsoluteFill style={{ background: WHITE, mixBlendMode: "screen", justifyContent: "center", paddingLeft: 150, paddingRight: 150 }}>
        <WordReveal text={text} size={text.length > 20 ? 150 : 210} delay={6} stagger={5} color="#000000" style={{ letterSpacing: "-0.02em", lineHeight: 1.0 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 230 }}>
        <AccentBar delay={2} width={200} />
      </div>
      <Quadrants x={1700} y={900} size={360} opacity={0.18} delay={4} />
    </AbsoluteFill>
  );
};

// ---------- Partner tiles drop in one per beat and confirm ----------
export const Partners: React.FC<{ t0: number; at: number[]; items?: [string, string?][] }> = ({ t0, at, items = [["Microsoft Azure"], ["AWS"], ["Google Cloud"]] }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround light />
      <div style={{ display: "flex", gap: 48, opacity: outFade(frame, d) }}>
        {items.map(([name, tier], i) => {
          const f = local(at[i]);
          return (
            <div
              key={name}
              style={{
                position: "relative",
                width: 540,
                height: 230,
                borderRadius: 22,
                background: WHITE,
                boxShadow: "0 24px 60px rgba(10,29,59,0.14)",
                borderTop: `8px solid ${BLUE}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 52,
                color: NAVY,
                opacity: interpolate(f, [-4, 4], [0, 1], clamp),
                translate: `0px ${interpolate(f, [-4, 10, 14], [-120, 8, 0], { ...clamp, easing: ease })}px`,
              }}
            >
              {name.startsWith("Microsoft") ? <Img src={staticFile("brand/microsoft.svg")} style={{ width: 56, height: 56 }} /> : null}
              <div style={{ display: "flex", flexDirection: "column", alignItems: name.startsWith("Microsoft") ? "flex-start" : "center", gap: 10 }}>
                {/* AWS and Google Cloud show their official logos in place of the name */}
                {name === "AWS" ? <Img src={staticFile("brand/aws.svg")} style={{ height: 92 }} /> : name.startsWith("Google") ? <Img src={staticFile("brand/google-cloud.svg")} style={{ width: 380 }} /> : name}
                {tier ? <span style={{ fontSize: 34, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>{tier}</span> : null}
              </div>
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <Tick p={interpolate(f, [10, 18], [0, 1], clamp)} size={36} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Product introduction: logo wipes on at the spoken name ----------
export const ProductCard: React.FC<{ t0: number; logo: string; at: number; light: boolean }> = ({ t0, logo, at, light }) => {
  const f = useLocal(t0)(at);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround light={light} />
      <Quadrants x={960} y={540} size={950} opacity={light ? 0.1 : 0.16} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 46, opacity: outFade(frame, d) }}>
        <div style={{ scale: interpolate(f, [-8, -2, 10], [0.96, 0.96, 1], { ...clamp, easing: ease }), filter: `drop-shadow(0 0 ${interpolate(f, [-10, 0, 16], [0, 40, 0], clamp)}px rgba(90,162,255,0.8))` }}>
          <Img src={staticFile(`brand/${logo}`)} style={{ width: 1150, clipPath: `inset(0 ${interpolate(f, [-2, 16], [100, 0], { ...clamp, easing: ease })}% 0 0)` }} />
        </div>
        <Pulse f={f - 16} size={500} color={light ? BLUE : SKY} />
        <div style={{ opacity: interpolate(f, [16, 22], [0, 1], clamp) }}>
          <AccentBar delay={Math.max(0, frame - Math.max(0, f - 16)) + 0} width={240} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7.3 stand-in: footage in a floating device frame until the approved IntelliXperience recording is supplied
export const Device: React.FC<{ src: string; logo: string }> = ({ src, logo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.8)", scale: 1.1 }}>
        <Video src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div
        style={{
          width: 1340,
          height: 780,
          borderRadius: 34,
          background: "#0b1426",
          padding: 22,
          boxShadow: "0 50px 120px rgba(10,29,59,0.55)",
          rotate: `${interpolate(frame, [0, d], [-1.2, 1.2])}deg`,
          translate: `0px ${interpolate(frame, [0, 16], [60, 0], { ...clamp, easing: ease })}px`,
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 18, overflow: "hidden" }}>
          <Video src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 70, background: WHITE, borderRadius: 18, padding: "18px 30px", boxShadow: "0 18px 40px rgba(10,29,59,0.3)", opacity: interpolate(frame, [12, 22], [0, 1], clamp) }}>
        <Img src={staticFile(`brand/${logo}`)} style={{ height: 60 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3.3: isolated experiments -> everyday operations ----------
export const Flip: React.FC<{ t0: number; at: number }> = ({ t0, at }) => {
  const f = useLocal(t0)(at);
  const pill = (label: string, active: boolean, p: number) => (
    <div style={{ padding: "22px 40px", borderRadius: 999, fontWeight: 700, fontSize: 46, background: active ? BLUE : "#e3e9f2", color: active ? WHITE : "#5b6b84", opacity: active ? p : 1, scale: active ? interpolate(p, [0, 1], [0.85, 1]) : 1, display: "flex", alignItems: "center", gap: 16 }}>
      {label}
      {active ? <Tick p={interpolate(f, [6, 14], [0, 1], clamp)} size={46} color={WHITE === "#ffffff" ? OK : OK} /> : null}
    </div>
  );
  return (
    <Glass width={1500} style={{ display: "flex", alignItems: "center", gap: 30, justifyContent: "center" }}>
      <div style={{ opacity: interpolate(f, [-14, 0], [1, 0.45], clamp) }}>{pill("Isolated experiments", false, 1)}</div>
      <svg width="160" height="40" viewBox="0 0 160 40">
        <path d="M5 20 H145 M130 8 L148 20 L130 32" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset={200 * (1 - interpolate(f, [-14, 0], [0, 1], { ...clamp, easing: ease }))} />
      </svg>
      {pill("Everyday operations", true, interpolate(f, [0, 8], [0, 1], { ...clamp, easing: ease }))}
    </Glass>
  );
};

// ---------- 8.4: three status rows go checking -> verified ----------
export const Checks: React.FC<{ t0: number; at: number | number[]; title?: string; rows?: string[]; done?: string }> = ({ t0, at, title = "IntelliAssure", rows = ["Reliability", "Control", "Accountability"], done: doneLabel = "Verified" }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  return (
    <Glass width={1000}>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE, marginBottom: 20 }}>{title}</div>
      {rows.map((label, i) => {
        const f = local(Array.isArray(at) ? at[i] : at + i * 0.7);
        const done = f >= 0;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", borderTop: i ? "2px solid #e3e9f2" : "none" }}>
            <span style={{ fontSize: 56, fontWeight: 800 }}>{label}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 700, color: done ? OK : "#8a97ab" }}>
              {done ? doneLabel : "Checking"}
              {done ? (
                <Tick p={interpolate(f, [0, 10], [0, 1], clamp)} size={52} />
              ) : (
                <svg width="52" height="52" viewBox="0 0 52 52" style={{ rotate: `${frame * 12}deg` }}>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="#c9d3e2" strokeWidth="6" />
                  <path d="M26 6 a20 20 0 0 1 20 20" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </div>
        );
      })}
    </Glass>
  );
};

// ---------- 9.4: alert detected -> investigating -> contained -> resolved ----------
export const Incident: React.FC<{ t0: number; at: number[]; labels?: string[]; steps?: string[]; idle?: string }> = ({ t0, at, labels = ["Alert detected", "Investigating", "Contained", "Resolved"], steps = ["24×7 security operations", "Intelligent threat detection", "Coordinated incident response", "Resolved"], idle = "Monitoring" }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const phase = at.filter((t) => local(t) >= 0).length; // 0..4
  const color = phase <= 1 ? AMBER : phase < 4 ? BLUE : OK;
  const fPhase = phase ? local(at[phase - 1]) : 0;
  return (
    <Glass width={1300}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={staticFile("brand/bluforge-lockup.png")} style={{ height: 90, borderRadius: 10 }} />
          <span style={{ fontSize: 34, fontWeight: 700, color: "#5b6b84" }}>Security Center</span>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "16px 30px", borderRadius: 999, background: color, color: WHITE, fontSize: 40, fontWeight: 800, scale: interpolate(fPhase, [0, 4, 10], [0.92, 1.05, 1], { ...clamp, easing: ease }) }}>
          {phase === 1 ? <span style={{ width: 18, height: 18, borderRadius: "50%", background: WHITE, opacity: 0.5 + 0.5 * Math.sin(frame / 3) }} /> : null}
          {phase === 0 ? idle : labels[phase - 1]}
          {phase === 4 ? <Tick p={interpolate(fPhase, [0, 10], [0, 1], clamp)} size={44} color={WHITE} /> : null}
          <Pulse f={fPhase} size={260} color={color} />
        </div>
      </div>
      {/* Scan bar while investigating */}
      <div style={{ height: 14, borderRadius: 7, background: "#e3e9f2", overflow: "hidden", marginBottom: 34 }}>
        <div style={{ height: "100%", width: `${interpolate(frame, [0, 200], [0, 100], clamp)}%`, background: `linear-gradient(90deg, ${AMBER}, ${BLUE} 55%, ${OK})` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {steps.map((s, i) => {
          const on = phase > i;
          return (
            <div key={s} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 20, borderRadius: 18, background: on ? (i === 3 ? "#e3f6ec" : "#dce9ff") : "#f2f5fa", opacity: on ? 1 : 0.6 }}>
              <Tick p={on ? interpolate(local(at[i]), [0, 10], [0, 1], clamp) : 0} size={40} color={i === 3 ? OK : BLUE} />
              <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{s}</span>
            </div>
          );
        })}
      </div>
    </Glass>
  );
};

// ---------- 10.5: AI workflow nodes light in order, production confirms ----------
export const Workflow: React.FC<{ t0: number; at: number[]; nodes?: string[]; title?: string }> = ({ t0, at, nodes = ["Identify opportunities", "Redesign workflows", "Build governed AI", "Production"], title = "Quadra AIR · AI-In-Residence" }) => {
  const local = useLocal(t0);
  return (
    <Glass width={1600} style={{ padding: "60px 64px" }}>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE, marginBottom: 40 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {nodes.map((n, i) => {
          const f = local(at[i]);
          const on = f >= 0;
          const last = i === nodes.length - 1;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: last ? "0 0 auto" : 1 }}>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 260 }}>
                <div style={{ position: "relative", width: 96, height: 96, borderRadius: "50%", display: "grid", placeItems: "center", background: on ? (last ? OK : BLUE) : "#e3e9f2", scale: interpolate(f, [-6, 0, 6, 10], [1, 0.9, 1.08, 1], clamp), fontSize: 40, fontWeight: 800, color: on ? WHITE : "#8a97ab" }}>
                  {last && on ? <Tick p={interpolate(f, [0, 10], [0, 1], clamp)} size={60} color={OK} /> : i + 1}
                  <Pulse f={f} size={110} color={last ? OK : BLUE} />
                </div>
                <span style={{ fontSize: 30, fontWeight: 700, textAlign: "center", lineHeight: 1.2, color: on ? NAVY : "#8a97ab" }}>{n}</span>
              </div>
              {!last ? (
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#e3e9f2", marginBottom: 60, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${interpolate(local(at[i + 1]), [-24, 0], [0, 100], clamp)}%`, background: BLUE }} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Glass>
  );
};

// ---------- Counters (Scene 6) and the recap row ----------
const countUp = (value: string, p: number) => {
  const n = Number(value.replace(/[^0-9]/g, ""));
  return Math.round(n * p).toLocaleString("en-US") + value.replace(/[0-9,]/g, "");
};

export const Counter: React.FC<{ t0: number; v: string; label: string; at: number; recapAt?: number }> = ({ t0, v, label, at, recapAt }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const f = local(at);
  const r = recapAt ? local(recapAt) : -999;
  const p = interpolate(f, [-2, 38], [0, 1], { ...clamp, easing: ease });
  const single = interpolate(r, [0, 8], [1, 0], clamp);
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,29,59,0.85) 0%, rgba(10,29,59,0.5) 40%, rgba(10,29,59,0) 68%)", opacity: interpolate(frame, [0, 10], [0, 1], clamp) * outFade(frame, d) }} />
      <div style={{ position: "absolute", left: 140, bottom: 150, display: "flex", flexDirection: "column", gap: 18, opacity: single * outFade(frame, d) }}>
        <AccentBar delay={Math.max(0, frame - Math.max(0, f))} width={160} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, lineHeight: 0.95, color: WHITE, scale: interpolate(f, [36, 40, 46], [1, 1.04, 1], clamp), transformOrigin: "left bottom" }}>{countUp(v, p)}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 56, letterSpacing: "0.12em", color: SKY, textTransform: "uppercase", opacity: interpolate(f, [6, 14], [0, 1], clamp) }}>{label}</div>
      </div>
      {recapAt ? (
        <div style={{ position: "absolute", left: 140, right: 140, bottom: 160, display: "flex", gap: 30, opacity: interpolate(r, [2, 10], [0, 1], clamp) * outFade(frame, d) }}>
          {[["25", "Years"], ["100+", "Awards"], ["1,000+", "Certifications"], ["3,000+", "Customers"]].map(([n, l], i) => (
            <div key={l} style={{ flex: 1, padding: "26px 30px", borderRadius: 22, background: "rgba(255,255,255,0.92)", color: NAVY, fontFamily: FONT, translate: `0px ${interpolate(r - i * 4, [0, 14], [60, 0], { ...clamp, easing: ease })}px`, opacity: interpolate(r - i * 4, [0, 8], [0, 1], clamp) }}>
              <div style={{ fontSize: 90, fontWeight: 800, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: BLUE, letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

// ---------- 9.1 / 9.2: words stamp in on the beat ----------
export const Stamp: React.FC<{ t0: number; text: string; at: number; shield?: boolean; step?: number; size?: number }> = ({ t0, text, at, shield, step = 0.36, size = 140 }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const words = text.split(" ");
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround />
      {shield ? (
        <svg width="760" height="860" viewBox="0 0 760 860" style={{ position: "absolute", opacity: 0.5 }}>
          <path d="M380 30 L700 140 V420 C700 640 560 760 380 830 C200 760 60 640 60 420 V140 Z" fill="none" stroke={BLUE} strokeWidth="10" strokeDasharray="2600" strokeDashoffset={2600 * (1 - interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: ease }))} />
        </svg>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 36px", maxWidth: 1600, opacity: outFade(frame, d, 6) }}>
        {words.map((w, i) => {
          const f = local(at + i * step);
          return (
            <span key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: WHITE, opacity: interpolate(f, [-2, 2], [0, 1], clamp), scale: interpolate(f, [-2, 6], [1.5, 1], { ...clamp, easing: ease }), filter: `blur(${interpolate(f, [-2, 5], [12, 0], clamp)}px)` }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9.3: BluForge ----------
export const BluForge: React.FC<{ t0: number; at: number }> = ({ t0, at }) => {
  const f = useLocal(t0)(at);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround light />
      <Quadrants x={960} y={500} size={860} opacity={0.12} />
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", top: 220, width: 520, height: 520, borderRadius: "50%", border: `3px solid ${BLUE}`, opacity: interpolate(f - 8 - k * 10, [0, 30], [0.6, 0], clamp), scale: interpolate(f - 8 - k * 10, [0, 30], [0.8, 1.5], clamp) }} />
      ))}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46, opacity: outFade(frame, d) }}>
        <Img src={staticFile("brand/bluforge-lockup.png")} style={{ width: 480, borderRadius: 24, boxShadow: "0 30px 80px rgba(10,29,59,0.18)", opacity: interpolate(f, [-2, 8], [0, 1], clamp), scale: interpolate(f, [-6, -2, 20], [0.85, 0.85, 1], { ...clamp, easing: ease, output: "perceptual-scale" }) }} />
        <WordReveal text="Microsoft MISA-verified managed cyber-defence" size={54} weight={700} delay={Math.max(0, frame - f) + 20} color={NAVY} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 10.3: Quadra AIR ----------
export const Air: React.FC<{ t0: number; at: number }> = ({ t0, at }) => {
  const f = useLocal(t0)(at);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const base = Math.max(0, frame - f);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <BrandGround />
      <Quadrants x={960} y={540} size={950} opacity={0.16} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, opacity: outFade(frame, d) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ position: "relative", width: 180, height: 180, borderRadius: 40, background: WHITE, display: "grid", placeItems: "center", scale: interpolate(f, [-6, -2, 12], [0.6, 0.6, 1], { ...clamp, easing: ease }), opacity: interpolate(f, [-4, 4], [0, 1], clamp) }}>
            <Img src={staticFile("brand/quadra-air.png")} style={{ width: 120 }} />
            <Pulse f={f - 10} size={200} color={WHITE} />
          </div>
          <WordReveal text="Quadra AIR" size={140} delay={base + 2} />
        </div>
        <AccentBar delay={base + 14} width={240} />
        <WordReveal text="AI-In-Residence" size={60} weight={600} delay={base + 18} color={SKY} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 13.11: three window tiles of CoE moments ----------
export const Grid: React.FC<{ shots: (number | string)[] }> = ({ shots }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: 80, top: 150, display: "flex", flexDirection: "column", gap: 24 }}>
      {shots.map((n, i) => {
        const f = frame - 6 - i * 6;
        const out = interpolate(frame, [96, 110], [1, 0], clamp);
        return (
          <div key={n} style={{ width: 460, height: 258, borderRadius: 24, overflow: "hidden", border: `6px solid ${WHITE}`, boxShadow: "0 20px 50px rgba(10,29,59,0.35)", opacity: interpolate(f, [0, 8], [0, 1], clamp) * out, translate: `${interpolate(f, [0, 16], [120, 0], { ...clamp, easing: ease })}px 0px` }}>
            <Video src={staticFile(typeof n === "string" ? n : shotFile(n))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
    </div>
  );
};

// ---------- 14.2-14.5: role words ----------
export const Role: React.FC<{ text: string; corner: "tl" | "br" }> = ({ text, corner }) => {
  const frame = useCurrentFrame();
  const pos: React.CSSProperties = corner === "tl" ? { left: 120, top: 170 } : { right: 120, bottom: 140, textAlign: "right" };
  return (
    <div style={{ position: "absolute", ...pos, fontFamily: FONT, fontWeight: 800, fontSize: 130, color: WHITE, textTransform: "uppercase", textShadow: "0 6px 40px rgba(10,29,59,0.6)", opacity: interpolate(frame, [0, 3], [0, 1], clamp), scale: interpolate(frame, [0, 8], [1.25, 1], { ...clamp, easing: ease }), transformOrigin: corner === "tl" ? "left top" : "right bottom" }}>
      {text}
      <div style={{ height: 12, marginTop: 10, background: BLUE, borderRadius: 6, transformOrigin: corner === "tl" ? "left" : "right", scale: `${interpolate(frame, [3, 14], [0, 1], { ...clamp, easing: ease })} 1` }} />
    </div>
  );
};

// ---------- 15.2: corner words on 'cloud', 'AI', 'security' ----------
export const Corners: React.FC<{ t0: number; items: [string, number, "tl" | "tr" | "bl"][] }> = ({ t0, items }) => {
  const local = useLocal(t0);
  const place = { tl: { left: 120, top: 150 }, tr: { right: 120, top: 150 }, bl: { left: 120, bottom: 140 } };
  return (
    <>
      <AbsoluteFill style={{ background: "rgba(10,29,59,0.3)" }} />
      {items.map(([w, at, c]) => {
        const f = local(at);
        return (
          <div key={w} style={{ position: "absolute", ...place[c], fontFamily: FONT, fontWeight: 800, fontSize: 150, color: WHITE, textShadow: "0 6px 40px rgba(10,29,59,0.6)", opacity: interpolate(f, [-2, 3], [0, 1], clamp), scale: interpolate(f, [-2, 8], [1.3, 1], { ...clamp, easing: ease }) }}>
            {w}
          </div>
        );
      })}
    </>
  );
};

// ---------- 15.3: call to action ----------
export const Cta: React.FC<{ t0: number; at: number; bg: string }> = ({ t0, at, bg }) => {
  const f = useLocal(t0)(at);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const open = interpolate(f, [14, 26], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ filter: "blur(16px) brightness(0.75)", scale: 1.1 }}>
        <Video src={staticFile(bg)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50, opacity: outFade(frame, d, 6) }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "34px 70px",
            borderRadius: 999,
            background: WHITE,
            color: NAVY,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 70,
            boxShadow: `0 0 ${interpolate(f, [-14, -2, 6], [0, 60, 20], clamp)}px rgba(90,162,255,0.9), 0 30px 80px rgba(10,29,59,0.4)`,
            scale: interpolate(f, [-14, -4, 0, 6], [1, 1.04, 0.96, 1], clamp),
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        >
          Start a conversation
          {f >= 6 ? <Tick p={interpolate(f, [6, 14], [0, 1], clamp)} size={64} /> : null}
          <Pulse f={f} size={300} color={SKY} />
        </div>
        <div style={{ display: "flex", gap: 30, opacity: open, translate: `0px ${interpolate(open, [0, 1], [40, 0])}px` }}>
          {["www.quadrasystems.net", "ai@quadrasystems.net"].map((t) => (
            <div key={t} style={{ padding: "18px 34px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: NAVY, fontFamily: FONT, fontWeight: 700, fontSize: 44 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 15.5: end card, fades to navy so the film loops ----------
export const EndCard: React.FC<{ qr?: React.ReactNode; clear?: boolean }> = ({ qr, clear }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: clear ? undefined : NAVY, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 110, opacity: interpolate(frame, [0, 10, d - 36, d - 6], [0, 1, 1, 0], clamp) }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <Img src={staticFile("brand/quadra-white.png")} style={{ width: 520 }} />
        {["www.quadrasystems.net", "ai@quadrasystems.net"].map((t, i) => (
          <div key={t} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 56, color: WHITE, opacity: interpolate(frame - 6 - i * 6, [0, 10], [0, 1], clamp), translate: `${interpolate(frame - 6 - i * 6, [0, 16], [-50, 0], { ...clamp, easing: ease })}px 0px` }}>
            {t}
          </div>
        ))}
      </div>
      {qr ? <div style={{ opacity: interpolate(frame, [8, 18], [0, 1], clamp) }}>{qr}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Overlays that span several cuts ----------
export const ShieldOverlay: React.FC<{ t0: number; rings: number[]; scan: number[]; done: number }> = ({ t0, rings, scan, done }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const fd = local(done);
  return (
    <div style={{ position: "absolute", right: 170, top: 250, width: 520, height: 520, opacity: interpolate(frame, [0, 8, d - 10, d], [0, 1, 1, 0], clamp) }}>
      {[0, 1, 2].map((i) => {
        const f = local(rings[i]);
        const size = 520 - i * 130;
        return (
          <div key={i} style={{ position: "absolute", left: (520 - size) / 2, top: (520 - size) / 2, width: size, height: size, borderRadius: "50%", border: `6px solid ${f >= 0 ? SKY : "rgba(255,255,255,0.35)"}`, scale: interpolate(f, [0, 6, 10], [1.25, 0.98, 1], clamp), boxShadow: f >= 0 ? "0 0 30px rgba(90,162,255,0.6)" : "none" }} />
        );
      })}
      {/* Scan line */}
      <div style={{ position: "absolute", left: 30, right: 30, height: 6, borderRadius: 3, background: SKY, top: interpolate(local(scan[0]), [0, (scan[1] - scan[0]) * 30], [40, 480], clamp), opacity: local(scan[0]) >= 0 && local(scan[1]) < 0 ? 0.9 : 0 }} />
      <svg width="200" height="230" viewBox="0 0 200 230" style={{ position: "absolute", left: 160, top: 145 }}>
        <path d="M100 8 L188 40 V112 C188 170 150 204 100 222 C50 204 12 170 12 112 V40 Z" fill={fd >= 0 ? BLUE : "rgba(10,29,59,0.5)"} stroke={WHITE} strokeWidth="8" />
        <path d="M62 116 l26 26 l52 -56" fill="none" stroke={WHITE} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="120" strokeDashoffset={120 * (1 - interpolate(fd, [0, 12], [0, 1], clamp))} />
      </svg>
      <Pulse f={fd} size={560} color={SKY} />
    </div>
  );
};

export const TrackerOverlay: React.FC<{ t0: number; steps: string[]; at: number[] }> = ({ t0, steps, at }) => {
  const local = useLocal(t0);
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const step = at.filter((t) => local(t) >= 0).length;
  return (
    <div style={{ position: "absolute", top: 150, left: 80, display: "flex", alignItems: "center", gap: 16, padding: 10, borderRadius: 999, background: "rgba(10,29,59,0.8)", opacity: interpolate(frame, [4, 14, d - 10, d], [0, 1, 1, 0], clamp) }}>
      {steps.map((label, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        const f = local(at[i]);
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {i > 0 ? (
              <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.3)", overflow: "hidden", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${interpolate(f, [-12, 0], [0, 100], clamp)}%`, background: SKY }} />
              </div>
            ) : null}
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 24px", borderRadius: 999, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: active ? WHITE : NAVY, background: active ? BLUE : WHITE, opacity: active || done ? 1 : 0.7, scale: active ? interpolate(f, [0, 6, 10], [0.88, 1.05, 1], clamp) : 1 }}>
              {done ? <Tick p={1} size={30} /> : null}
              {label}
              {active ? <Pulse f={f} size={120} color={SKY} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { OK };
