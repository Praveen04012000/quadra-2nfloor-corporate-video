import { AbsoluteFill, Series } from "remotion";
import { FPS, SCENES } from "./scenes/data";
import { NAVY, Scene } from "./scenes/Scene";
import { Close } from "./scenes/Close";

// 15 scenes back to back, 05:00 total. Each scene fades through navy, so cuts stay on the storyboard timecodes.
export const QuadraVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
  <Series>
    {SCENES.map((s, i) => (
      <Series.Sequence key={s.id} name={s.title} durationInFrames={s.seconds * FPS}>
        {i === SCENES.length - 1 ? <Close /> : <Scene index={i} />}
      </Series.Sequence>
    ))}
  </Series>
  </AbsoluteFill>
);
