import { Composition, Folder } from "remotion";
import { QuadraVideo } from "./QuadraVideo";
import { FPS, SCENES, TOTAL_FRAMES } from "./scenes/data";
import { Scene } from "./scenes/Scene";
import { Close } from "./scenes/Close";
import { CINE_FRAMES, CinematicFilm } from "./cine/CinematicFilm";
import { QuadraIntro } from "./intro/Intro";
import { INTRO2_FRAMES, QuadraIntro2 } from "./intro2/Film";
import { TOTAL as INTRO_FRAMES } from "./intro/plan";
import { TV_FRAMES, TvFilm } from "./tv/TvFilm";
import { TV_FPS } from "./tv/script";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="QuadraOfficeTV" component={TvFilm} durationInFrames={TV_FRAMES} fps={TV_FPS} width={1920} height={1080} />
      <Composition id="QuadraIntro" component={QuadraIntro2} durationInFrames={INTRO2_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="QuadraIntroV1" component={QuadraIntro} durationInFrames={INTRO_FRAMES} fps={FPS} width={1920} height={1080} />
      <Composition
        id="QuadraCinematic"
        component={CinematicFilm}
        durationInFrames={CINE_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="QuadraVideo"
        component={QuadraVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        {SCENES.slice(0, -1).map((s, i) => (
          <Composition
            key={s.id}
            id={s.id}
            component={Scene}
            defaultProps={{ index: i }}
            durationInFrames={s.seconds * FPS}
            fps={FPS}
            width={1920}
            height={1080}
          />
        ))}
        <Composition
          id={SCENES[SCENES.length - 1].id}
          component={Close}
          durationInFrames={SCENES[SCENES.length - 1].seconds * FPS}
          fps={FPS}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
