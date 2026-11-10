// Quadra 5-minute corporate video. Shot list: src/shots.json (same list as the storyboard).
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import shotsJson from "../shots.json";
import { FPS, SCENES } from "../scenes/data";
import { NAVY, SceneWipe } from "./kit";
import { BluForgeCard, ClipShot, EndCard, EndLogo, PartnersCard, Shot, TitleCard, WordsCard } from "./Shots";
import { VO_LINES } from "./voiceoverTrack";

export const SHOTS = shotsJson as Shot[];
export const CINE_FRAMES = Math.round(SHOTS[SHOTS.length - 1].t1 * FPS);

// Story steps shown in the tracker for the two customer stories
const STEPS: Record<number, string[]> = {
  11: ["Business Challenge", "Quadra Solution", "Outcome"],
  12: ["Business Challenge", "Security Solution", "Outcome"],
};

const ShotView: React.FC<{ shot: Shot; index: number }> = ({ shot, index }) => {
  switch (shot.kind) {
    case "clip":
      return <ClipShot shot={shot} index={index} chapter={{ no: shot.s, title: SCENES[shot.s - 1].title, steps: STEPS[shot.s] }} />;
    case "card":
      return <TitleCard shot={shot} />;
    case "partners":
      return <PartnersCard />;
    case "words":
      return <WordsCard shot={shot} />;
    case "bluforge":
      return <BluForgeCard shot={shot} />;
    case "endLogo":
      return <EndLogo shot={shot} />;
    case "endCard":
      return <EndCard />;
  }
};

const sceneStarts = SCENES.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].seconds * FPS], []);

export const CinematicFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    {SHOTS.map((shot, i) => (
      <Sequence
        key={i}
        name={`${shot.s}.${SHOTS.slice(0, i + 1).filter((x) => x.s === shot.s).length} ${shot.source ?? shot.kind}`}
        from={Math.round(shot.t0 * FPS)}
        durationInFrames={Math.round((shot.t1 - shot.t0) * FPS)}
        premountFor={45}
      >
        <ShotView shot={shot} index={i} />
      </Sequence>
    ))}

    {/* Branded wipe centred on every scene change */}
    {sceneStarts.slice(1).map((f) => (
      <Sequence key={f} name="Scene wipe" from={f - 10} durationInFrames={24}>
        <SceneWipe />
      </Sequence>
    ))}

    {VO_LINES.map((v) => (
      <Sequence key={v.src} name={`Voiceover ${v.scene}`} from={v.from} durationInFrames={v.dur} layout="none">
        <Audio src={staticFile(v.src)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
