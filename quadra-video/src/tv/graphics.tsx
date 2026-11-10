// Motion graphics for the Office TV film, following the production pack's shot list.
// Every card arrives on its spoken word: anticipation (fade/scale-in), action, confirmation (orange edge / tick).
import QRCode from "qrcode";
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Ground, T, Tick, clamp, ease, gradientText, usePop } from "./theme";
import { Quadrants } from "../cine/kit";

const lf = (t: number, base: number) => Math.round((t - base) * 25); // absolute seconds -> local frame

// ---------- 1 · logo reveal and the engine → transmission → outcomes cards ----------
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center", gap: 34, display: "flex", flexDirection: "column" }} className="tvcard"><Ground />
      <Img src={staticFile("brand/quadra-white.png")} style={{ width: 820, clipPath: `inset(0 ${interpolate(frame, [8, 40], [100, 0], { ...clamp, easing: ease })}% 0 0)`, opacity: interpolate(frame, [d - 10, d], [1, 0], clamp) }} />
      <div style={{ width: interpolate(frame, [30, 55], [0, 360], { ...clamp, easing: ease }), height: 6, background: `linear-gradient(90deg, ${T.gradA}, ${T.gradB})`, borderRadius: 3 }} />
    </AbsoluteFill>
  );
};

export const EngineCards: React.FC<{ base: number; at: [number, number, number] }> = ({ base, at }) => {
  const labels = ["Engine", "Transmission", "Outcomes"];
  const subs = ["Raw technology capability", "Quadra", "Business results"];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 300, display: "flex", alignItems: "center", gap: 30 }}>
      {labels.map((l, i) => {
        const { f, style } = usePop(lf(at[i], base));
        return (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 30, flex: 1 }}>
            <Card lit={i === 1 && f > 8} style={{ flex: 1, padding: "40px 36px", ...style }}>
              <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 64, ...(i === 1 ? gradientText : {}) }}>{l}</div>
              <div style={{ fontSize: 30, color: T.muted, marginTop: 10, fontWeight: 600 }}>{subs[i]}</div>
            </Card>
            {i < 2 ? (
              <svg width="80" height="30" viewBox="0 0 80 30" style={{ opacity: interpolate(f, [8, 16], [0, 1], clamp) }}>
                <path d="M4 15 H70 M58 5 L74 15 L58 25" fill="none" stroke={T.orange} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// ---------- 2 · partner badges, workload routing, IP card ----------
export const PartnerBadges: React.FC<{ base: number; at: [number, number, number] }> = ({ base, at }) => {
  const items: [string, string][] = [["Microsoft", "Frontier"], ["AWS", "Premier"], ["Google Cloud", "Premier"]];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 250, display: "flex", gap: 36 }}>
      {items.map(([name, tier], i) => {
        const { f, style } = usePop(lf(at[i], base));
        return (
          <Card key={name} lit={f > 4 && f < 30} style={{ flex: 1, padding: "44px 40px", display: "flex", flexDirection: "column", gap: 14, ...style, translate: `0px ${interpolate(f, [-2, 10], [-60, 0], { ...clamp, easing: ease })}px` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 52, fontWeight: 800 }}>
              {name === "Microsoft" ? <Img src={staticFile("brand/microsoft.svg")} style={{ width: 52, height: 52 }} /> : null}
              {name}
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: T.orange, letterSpacing: "0.08em", textTransform: "uppercase" }}>{tier}</div>
          </Card>
        );
      })}
    </div>
  );
};

export const Routing: React.FC<{ base: number; at: number }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const f = frame - lf(at, base);
  const clouds = ["Microsoft Azure", "AWS", "Google Cloud"];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 250, height: 420 }}>
      <Card style={{ position: "absolute", left: 0, top: 150, width: 330, padding: "30px 34px", fontSize: 44, fontWeight: 800, opacity: interpolate(f, [-4, 6], [0, 1], clamp) }}>Workloads</Card>
      {clouds.map((c, i) => {
        const y = 30 + i * 150;
        const p = interpolate(f, [6 + i * 8, 26 + i * 8], [0, 1], { ...clamp, easing: ease });
        return (
          <div key={c}>
            <svg style={{ position: "absolute", left: 340, top: 0 }} width="700" height="440">
              <path d={`M0 200 C 300 200, 380 ${y + 40}, 690 ${y + 40}`} fill="none" stroke={T.orange} strokeWidth="5" strokeDasharray="900" strokeDashoffset={900 * (1 - p)} />
            </svg>
            <Card lit={p > 0.98} style={{ position: "absolute", left: 1040, top: y, width: 520, padding: "22px 30px", fontSize: 40, fontWeight: 700, opacity: interpolate(p, [0.6, 1], [0, 1], clamp) }}>{c}</Card>
          </div>
        );
      })}
    </div>
  );
};

export const IpCard: React.FC<{ base: number; at: number; name: string; line: string; icon?: string; kicker?: string; x?: number; y?: number; width?: number }> = ({ base, at, name, line, icon, kicker, x, y, width = 760 }) => {
  const { f, style } = usePop(lf(at, base));
  return (
    <Card lit={f > 6} style={{ position: "absolute", left: x ?? T.safeX + 44, top: y ?? 300, width, padding: "40px 44px", display: "flex", gap: 30, alignItems: "center", ...style, translate: `${interpolate(f, [-2, 12], [-50, 0], { ...clamp, easing: ease })}px 0px` }}>
      {icon ? (
        <div style={{ width: 120, height: 120, borderRadius: 24, background: T.white, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Img src={staticFile(icon)} style={{ maxWidth: 88, maxHeight: 88 }} />
        </div>
      ) : null}
      <div>
        {kicker ? <div style={{ fontSize: 26, fontWeight: 700, color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{kicker}</div> : null}
        <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 68, lineHeight: 1.05, ...gradientText }}>{name}</div>
        <div style={{ fontSize: 34, fontWeight: 600, color: T.muted, marginTop: 10, lineHeight: 1.3 }}>{line}</div>
      </div>
    </Card>
  );
};

// ---------- 3 · counter, product device, ISO badge ----------
const countUp = (value: string, p: number) => {
  const n = Number(value.replace(/[^0-9]/g, ""));
  return Math.round(n * p).toLocaleString("en-US") + value.replace(/[0-9,]/g, "");
};

export const Counter: React.FC<{ base: number; at: number; value: string; label: string; sub?: string; x?: number; y?: number }> = ({ base, at, value, label, sub, x, y }) => {
  const frame = useCurrentFrame();
  const f = frame - lf(at, base);
  const p = interpolate(f, [0, 32], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", left: x ?? T.safeX + 44, top: y ?? 330, opacity: interpolate(f, [-4, 4], [0, 1], clamp) }}>
      <div style={{ fontFamily: T.textFont, fontWeight: 800, fontSize: 190, lineHeight: 0.95, color: T.white, scale: interpolate(f, [32, 36, 42], [1, 1.04, 1], clamp), transformOrigin: "left bottom" }}>{countUp(value, p)}</div>
      <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 52, color: T.orange, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 12 }}>{label}</div>
      {sub ? <div style={{ fontFamily: T.textFont, fontWeight: 600, fontSize: 34, color: T.muted, marginTop: 10, maxWidth: 900, opacity: interpolate(f, [24, 34], [0, 1], clamp) }}>{sub}</div> : null}
    </div>
  );
};

export const Device: React.FC<{ ui: string }> = ({ ui }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }} className="tvcard"><Ground />
      <AbsoluteFill style={{ filter: "blur(24px) brightness(0.45)", scale: 1.1 }}>
        <Video src={staticFile(ui)} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", right: T.safeX + 20, top: 170, width: 1000, height: 600, borderRadius: 28, background: "#071428", padding: 18, border: `2px solid ${T.border}`, boxShadow: "0 50px 120px rgba(0,0,0,0.6)", rotate: `${interpolate(frame, [0, d], [-1, 1])}deg`, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 14, overflow: "hidden" }}>
          <Video src={staticFile(ui)} muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const IsoBadge: React.FC<{ base: number; at: number }> = ({ base, at }) => {
  const { f, style } = usePop(lf(at, base));
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, top: 250, display: "flex", gap: 44, alignItems: "center", ...style }}>
      <div style={{ width: 300, height: 300, borderRadius: 30, background: T.white, display: "grid", placeItems: "center" }}>
        <Img src={staticFile("tv/brand/tuv-iso42001.png")} style={{ width: 260 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {["100% proprietary", "ISO/IEC 42001 certified"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: T.textFont, fontWeight: 800, fontSize: 58, color: T.white, opacity: interpolate(f - i * 8, [0, 8], [0, 1], clamp) }}>
            <Tick p={interpolate(f - i * 8, [4, 14], [0, 1], clamp)} size={52} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- 4 · four-tile grid, each tile lights with its IP ----------
export const FourTiles: React.FC<{ base: number; at: number[] }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const tiles: [string, string][] = [["Modern Work & Copilot", "Workspace MigrationX"], ["Security & Compliance", "Threat Doctor"], ["Threat Protection", "DefendX"], ["Hybrid Integration", "SCCM InsightX"]];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 140, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
      {tiles.map(([pillar, ip], i) => {
        const f = frame - lf(at[i], base);
        const on = f >= 0;
        return (
          <Card key={ip} lit={on} style={{ padding: "38px 42px", opacity: on ? 1 : 0.45, scale: interpolate(f, [-2, 6, 10], [0.98, 1.03, 1], clamp) }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: on ? T.orange : T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{pillar}</div>
            <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 66, marginTop: 8, ...(on ? gradientText : { color: T.muted }) }}>{ip}</div>
          </Card>
        );
      })}
    </div>
  );
};

// ---------- 5 · BluForge ----------
export const Stamp: React.FC<{ base: number; at: number; text: string }> = ({ base, at, text }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center" }} className="tvcard"><Ground />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 34px", maxWidth: 1500 }}>
        {words.map((w, i) => {
          const f = frame - lf(at, base) - i * 8;
          return (
            <span key={i} style={{ fontFamily: T.titleFont, fontWeight: 700, fontSize: 130, ...(i === words.length - 1 ? gradientText : { color: T.white }), opacity: interpolate(f, [-2, 3], [0, 1], clamp), scale: interpolate(f, [-2, 7], [1.4, 1], { ...clamp, easing: ease }), filter: `blur(${interpolate(f, [-2, 5], [10, 0], clamp)}px)` }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const BluForgeHero: React.FC<{ base: number; at: number }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const f = frame - lf(at, base);
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 44 }} className="tvcard"><Ground />
      <div style={{ display: "flex", alignItems: "center", gap: 50, opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
        <div style={{ width: 300, height: 300, borderRadius: 32, background: T.white, display: "grid", placeItems: "center", boxShadow: `0 0 80px rgba(31,111,235,${interpolate(f, [0, 12, 40], [0, 0.5, 0.25], clamp)})` }}>
          <Img src={staticFile("brand/bluforge-lockup.png")} style={{ width: 280 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontFamily: T.titleFont, fontWeight: 700, fontSize: 96, ...gradientText }}>BluForge</div>
          <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 46, color: T.white }}>Managed cyber defence,</div>
          <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 46, color: T.white }}>verified by Microsoft.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, padding: "14px 26px", borderRadius: 999, border: `2px solid ${T.orange}`, alignSelf: "flex-start", fontFamily: T.textFont, fontWeight: 800, fontSize: 34, color: T.white, opacity: interpolate(f, [0, 8], [0, 1], clamp), scale: interpolate(f, [0, 8, 12], [0.85, 1.05, 1], clamp) }}>
            <Img src={staticFile("brand/microsoft.svg")} style={{ width: 34, height: 34 }} />
            MISA · MXDR verified
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SecurityCenter: React.FC<{ base: number; at: number[] }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const tabs = ["Threats", "Incidents", "Posture", "Response"];
  const tiles = ["Ops", "Pulse", "Assist", "Shield"];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: 1500, padding: "40px 48px", opacity: interpolate(frame, [0, 10], [0, 1], clamp), scale: interpolate(frame, [0, 14], [0.96, 1], { ...clamp, easing: ease }) }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: 14, background: T.white, display: "grid", placeItems: "center" }}><Img src={staticFile("tv/brand/bluforge.png")} style={{ width: 56 }} /></div>
            <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 56, ...gradientText }}>BluForge Security Center</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.ok }}>● 24×7 operations</div>
        </div>
        <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
          {tabs.map((t, i) => (
            <div key={t} style={{ padding: "12px 26px", borderRadius: 999, fontSize: 30, fontWeight: 700, background: i === Math.min(3, Math.floor(frame / 50)) ? T.orange : "rgba(10,29,59,0.6)", color: T.white }}>{t}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {tiles.map((t, i) => {
            const f = frame - lf(at[i], base);
            const on = f >= 0;
            return (
              <div key={t} style={{ padding: "30px 28px", borderRadius: 18, background: on ? "rgba(31,111,235,0.14)" : "rgba(10,29,59,0.6)", border: `2px solid ${on ? T.orange : T.border}`, scale: interpolate(f, [-2, 6, 10], [1, 1.05, 1], clamp) }}>
                <Tick p={interpolate(f, [0, 10], [0, 1], clamp)} size={44} />
                <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 54, marginTop: 12 }}>{t}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 6 · five vendors stream into BluForge ----------
export const VendorStream: React.FC<{ base: number; at: number[] }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const vendors = ["Zscaler", "CrowdStrike", "Fortinet", "Sophos", "Barracuda"];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {vendors.map((v, i) => {
        const y = 170 + i * 150;
        const f = frame - lf(at[i], base);
        const p = interpolate(f, [0, 22], [0, 1], { ...clamp, easing: ease });
        return (
          <div key={v}>
            <Card lit={f > 0} style={{ position: "absolute", left: T.safeX + 44, top: y, width: 420, padding: "24px 32px", fontSize: 44, fontWeight: 800, opacity: interpolate(f, [-4, 4], [0.25, 1], clamp) }}>{v}</Card>
            <svg style={{ position: "absolute", left: T.safeX + 474, top: 0 }} width="900" height="1080">
              <path d={`M0 ${y + 50} C 420 ${y + 50}, 480 540, 880 540`} fill="none" stroke={T.orange} strokeWidth="4" strokeDasharray="1100" strokeDashoffset={1100 * (1 - p)} opacity={0.9} />
              <circle r="9" fill={T.white} opacity={p > 0 && p < 1 ? 1 : 0} cx={0} cy={0} style={{ offsetPath: `path("M0 ${y + 50} C 420 ${y + 50}, 480 540, 880 540")`, offsetDistance: `${p * 100}%` } as React.CSSProperties} />
            </svg>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: T.safeX + 60, top: 390, width: 300, height: 300, borderRadius: 36, background: T.white, display: "grid", placeItems: "center", boxShadow: `0 0 ${interpolate(frame - lf(at[4], base), [10, 24], [0, 90], clamp)}px rgba(31,111,235,0.6)` }}>
        <Img src={staticFile("brand/bluforge-lockup.png")} style={{ width: 270 }} />
      </div>
    </div>
  );
};

// ---------- 7 · partner row ----------
export const PartnerRow: React.FC<{ base: number; at: number[]; names: string[] }> = ({ base, at, names }) => (
  <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 300, display: "flex", flexWrap: "wrap", gap: 26 }}>
    {names.map((n, i) => {
      const { style } = usePop(lf(at[i], base));
      return <Card key={n} style={{ padding: "26px 44px", fontSize: 48, fontWeight: 800, ...style }}>{n}</Card>;
    })}
  </div>
);

// ---------- 8 · four estates join under ProAct+ ----------
export const Estates: React.FC<{ base: number; at: number[]; bar: number }> = ({ base, at, bar }) => {
  const frame = useCurrentFrame();
  const names = ["Cloud", "Microsoft 365", "Security", "On-premises"];
  const b = frame - lf(bar, base);
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 200 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
        {names.map((n, i) => {
          const { style } = usePop(lf(at[i], base));
          return (
            <Card key={n} lit={b >= 0} style={{ padding: "40px 30px", textAlign: "center", ...style }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: T.orange, letterSpacing: "0.14em" }}>ESTATE {i + 1}</div>
              <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 56, marginTop: 10 }}>{n}</div>
              <div style={{ fontSize: 28, color: T.muted, marginTop: 8, fontWeight: 600 }}>Defined SLA</div>
            </Card>
          );
        })}
      </div>
      <div style={{ marginTop: 30, height: 120, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(90deg, ${T.gradA}, ${T.gradB})`, fontFamily: T.titleFont, fontWeight: 700, fontSize: 72, color: T.white, clipPath: `inset(0 ${interpolate(b, [0, 16], [100, 0], { ...clamp, easing: ease })}% 0 0 round 20px)` }}>
        ProAct+
      </div>
    </div>
  );
};

// ---------- 9 · Diagnose → Architect → Operate, the AIR question ----------
export const Steps: React.FC<{ base: number; at: number[] }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const steps = ["Diagnose", "Architect", "Operate"];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 330, display: "flex", alignItems: "center", gap: 26 }}>
      {steps.map((s, i) => {
        const f = frame - lf(at[i], base);
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 26, flex: 1 }}>
            <Card lit={f >= 0} style={{ flex: 1, padding: "40px 34px", opacity: interpolate(f, [-4, 4], [0.3, 1], clamp), scale: interpolate(f, [-2, 6, 10], [0.96, 1.04, 1], clamp) }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: T.orange }}>STEP {i + 1}</div>
              <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 76 }}>{s}</div>
            </Card>
            {i < 2 ? <div style={{ width: 60, height: 6, background: T.orange, opacity: interpolate(f, [6, 14], [0, 1], clamp) }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

export const Quote: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center", padding: "0 220px" }} className="tvcard"><Ground />
      <div style={{ fontFamily: T.titleFont, fontStyle: "italic", fontWeight: 500, fontSize: 92, lineHeight: 1.2, textAlign: "center", ...gradientText, opacity: interpolate(frame, [0, 14], [0, 1], clamp), translate: `0px ${interpolate(frame, [0, 24], [30, 0], { ...clamp, easing: ease })}px` }}>
        “{text}”
      </div>
      <div style={{ marginTop: 40, fontFamily: T.textFont, fontWeight: 700, fontSize: 34, letterSpacing: "0.2em", color: T.muted, opacity: interpolate(frame, [20, 34], [0, 1], clamp) }}>QUADRA AIR · AI-IN-RESIDENCE</div>
    </AbsoluteFill>
  );
};

// ---------- 11 · principles ----------
export const Principles: React.FC<{ base: number; at: number[] }> = ({ base, at }) => {
  const names = ["Outcome-led", "Vendor-agnostic", "Senior leadership", "Local accountability"];
  const icons = [
    "M10 30 l12 12 l26 -26",
    "M8 22 h40 M8 34 h40 M20 10 v36 M36 10 v36",
    "M28 8 l6 14 l15 1 l-12 9 l4 15 l-13 -8 l-13 8 l4 -15 l-12 -9 l15 -1 z",
    "M28 6 c-10 0 -16 8 -16 16 c0 12 16 28 16 28 c0 0 16 -16 16 -28 c0 -8 -6 -16 -16 -16 z M28 16 a6 6 0 1 0 0.1 0",
  ];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 260, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
      {names.map((n, i) => {
        const { f, style } = usePop(lf(at[i], base));
        return (
          <Card key={n} lit={f > 0 && f < 25} style={{ padding: "40px 30px", ...style }}>
            <svg width="64" height="64" viewBox="0 0 56 56"><path d={icons[i]} fill="none" stroke={T.orange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 50, marginTop: 16, lineHeight: 1.1 }}>{n}</div>
          </Card>
        );
      })}
    </div>
  );
};

// ---------- 12 · industries and cities ----------
export const Industries: React.FC<{ base: number; at: number[] }> = ({ base, at }) => {
  const items: [string, string][] = [
    ["Leading banks", "M8 22 L28 10 L48 22 Z M12 24 v18 M22 24 v18 M34 24 v18 M44 24 v18 M8 44 h40"],
    ["Global pharmaceutical majors", "M16 40 L40 16 a8 8 0 0 0 -11 -11 L5 29 a8 8 0 0 0 11 11 Z M22 22 l11 11"],
    ["Iconic automakers", "M8 34 l6 -14 h28 l6 14 v8 h-40 z M14 42 a4 4 0 1 0 0.1 0 M42 42 a4 4 0 1 0 0.1 0"],
    ["Defence innovators", "M28 6 L46 13 V27 C46 39 38 46 28 50 C18 46 10 39 10 27 V13 Z"],
  ];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 420, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26 }}>
      {items.map(([n, d], i) => {
        const { style } = usePop(lf(at[i], base));
        return (
          <Card key={n} style={{ padding: "36px 30px", ...style }}>
            <svg width="70" height="70" viewBox="0 0 56 56"><path d={d} fill="none" stroke={T.orange} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 38, marginTop: 14, lineHeight: 1.2 }}>{n}</div>
          </Card>
        );
      })}
    </div>
  );
};

export const Cities: React.FC<{ base: number; at: number }> = ({ base, at }) => {
  const frame = useCurrentFrame();
  const cities = ["Mumbai", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Pune", "Cochin", "Coimbatore"];
  return (
    <div style={{ position: "absolute", left: T.safeX + 44, right: T.safeX + 44, top: 470, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
      {cities.map((c, i) => {
        const f = frame - lf(at, base) - i * 4;
        return (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 26px", borderRadius: 16, background: T.card, border: `2px solid ${T.border}`, fontFamily: T.textFont, fontWeight: 700, fontSize: 40, color: T.white, opacity: interpolate(f, [0, 6], [0, 1], clamp), translate: `0px ${interpolate(f, [0, 12], [30, 0], { ...clamp, easing: ease })}px` }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: T.orange }} />
            {c}
          </div>
        );
      })}
    </div>
  );
};

// ---------- 13 · ambition, logo, contact and QR ----------
export const AmbitionQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center" }} className="tvcard"><Ground />
      {[0, 1, 2, 3, 4].map((k) => (
        <svg key={k} width="80" height="120" viewBox="0 0 80 120" style={{ position: "absolute", left: 300 + k * 330, top: interpolate(frame, [0, 100], [1000, -200 - k * 40]), opacity: 0.55 }}>
          <path d="M40 110 V14 M14 40 L40 12 L66 40" fill="none" stroke={T.orange} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
      <div style={{ fontFamily: T.titleFont, fontWeight: 600, fontSize: 118, textAlign: "center", lineHeight: 1.1, ...gradientText, opacity: interpolate(frame, [0, 14], [0, 1], clamp) }}>
        What is your
        <br />
        enterprise ambition?
      </div>
    </AbsoluteFill>
  );
};

const qr = QRCode.create("https://www.quadrasystems.net/", { errorCorrectionLevel: "M" });
export const QrCode: React.FC<{ size: number }> = ({ size }) => {
  const n = qr.modules.size;
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} />);
  return (
    <div style={{ width: size, height: size, background: T.white, padding: size * 0.06, borderRadius: 16 }}>
      <svg viewBox={`0 0 ${n} ${n}`} width="100%" height="100%" fill="#000">{cells}</svg>
    </div>
  );
};

export const EndCard: React.FC<{ base: number; logoAt: number; contactAt: number }> = ({ base, logoAt, contactAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const l = frame - lf(logoAt, base);
  const c = frame - lf(contactAt, base);
  // The last 1.5 s fade to navy so the final frame matches frame one of the loop
  const out = interpolate(frame, [d - 38, d - 2], [1, 0], clamp);
  // Four quarter-discs drop in on the beat and lock into the Quadra mark just before the logo resolves
  const radii = ["100% 0 0 0", "0 100% 0 0", "0 0 0 100%", "0 0 100% 0"];
  const lockF = lf(logoAt, base);
  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, justifyContent: "center", alignItems: "center" }} className="tvcard">
      <AbsoluteFill className="tvground" style={{ background: `linear-gradient(135deg, #1f6feb, #0f4fc2)`, opacity: out }} />
      <AbsoluteFill className="tvground" style={{ opacity: out }}>
        <Quadrants x={960} y={540} size={1100} opacity={0.1} color={T.white} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - 130, top: 540 - 130, width: 260, height: 260, opacity: interpolate(l, [-4, 6], [1, 0], clamp) }}>
        {radii.map((br, i) => {
          const y = interpolate(frame, [i * 6, i * 6 + 10, i * 6 + 14, i * 6 + 18], [-900, 0, -30, 0], { ...clamp, easing: ease });
          const spread = interpolate(frame, [lockF - 6, lockF], [12, 3], clamp);
          return <div key={i} style={{ position: "absolute", left: i % 2 ? 130 : 0, top: i < 2 ? 0 : 130, width: 130, height: 130, borderRadius: br, background: T.white, translate: `${(i % 2 ? 1 : -1) * spread}px ${y + (i < 2 ? -1 : 1) * spread}px` }} />;
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 120, opacity: out }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Img src={staticFile("brand/quadra-white.png")} style={{ width: 760, clipPath: `inset(0 ${interpolate(l, [0, 24], [100, 0], { ...clamp, easing: ease })}% 0 0)` }} />
          <div style={{ fontFamily: T.titleFont, fontWeight: 800, fontSize: 80, color: T.white, opacity: interpolate(l, [20, 34], [0, 1], clamp) }}>Architecting Ambition.</div>
          <div style={{ fontFamily: T.textFont, fontWeight: 700, fontSize: 44, color: T.white, opacity: interpolate(c, [0, 10], [0, 1], clamp) }}>ai@quadrasystems.net</div>
          <div style={{ fontFamily: T.textFont, fontWeight: 600, fontSize: 36, color: "#dce9ff", opacity: interpolate(c, [4, 14], [0, 1], clamp) }}>www.quadrasystems.net</div>
        </div>
        <div style={{ opacity: interpolate(c, [0, 10], [0, 1], clamp), scale: interpolate(c, [0, 12], [0.9, 1], { ...clamp, easing: ease }) }}>
          {/* Pack: QR at least 15% of frame height; 300 px of 1080 is 28% */}
          <QrCode size={300} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
