// Voiceover placement and caption timing, from the ElevenLabs character timings in public/voiceover/sNN.json.
import s01 from "../../public/voiceover/s01.json";
import s02 from "../../public/voiceover/s02.json";
import s03 from "../../public/voiceover/s03.json";
import s04 from "../../public/voiceover/s04.json";
import s05 from "../../public/voiceover/s05.json";
import s06 from "../../public/voiceover/s06.json";
import s07 from "../../public/voiceover/s07.json";
import s08 from "../../public/voiceover/s08.json";
import s09 from "../../public/voiceover/s09.json";
import s10 from "../../public/voiceover/s10.json";
import s11 from "../../public/voiceover/s11.json";
import s12 from "../../public/voiceover/s12.json";
import s13 from "../../public/voiceover/s13.json";
import s14 from "../../public/voiceover/s14.json";
import s15 from "../../public/voiceover/s15.json";
import { FPS, SCENES } from "../scenes/data";
import { sentences, spoken } from "../voiceover";

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
const ALIGN: Alignment[] = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15];

export type VoLine = { scene: number; src: string; from: number; dur: number };
export type Caption = { text: string; from: number; dur: number };

export const VO_LINES: VoLine[] = [];
export const CAPTIONS: Caption[] = [];

let sceneStart = 0;
SCENES.forEach((scene, i) => {
  const a = ALIGN[i];
  const slot = scene.seconds;
  const len = a.character_end_times_seconds[a.character_end_times_seconds.length - 1];
  // Start a beat into the scene, never so late that the line runs past the cut
  const lead = Math.min(0.8, Math.max(0, (slot - len) * 0.3));
  const start = sceneStart + lead;
  VO_LINES.push({ scene: i + 1, src: `voiceover/s${String(i + 1).padStart(2, "0")}.mp3`, from: Math.round(start * FPS), dur: Math.ceil((len + 0.3) * FPS) });

  // Pair each written sentence with its spoken version and find where it sits in the audio
  const said = a.characters.join("");
  const written = sentences(scene.vo);
  const voiced = sentences(spoken(scene.vo));
  let cursor = 0;
  const times = voiced.map((v) => {
    const at = said.indexOf(v, cursor);
    const s = at >= 0 ? at : cursor;
    const e = Math.min(s + v.length - 1, a.characters.length - 1);
    cursor = e + 1;
    return { t0: a.character_start_times_seconds[s], t1: a.character_end_times_seconds[e] };
  });
  times.forEach((t, k) => {
    const next = k + 1 < times.length ? times[k + 1].t0 : t.t1 + 0.6;
    CAPTIONS.push({ text: written[k], from: Math.round((start + t.t0) * FPS), dur: Math.max(1, Math.round((next - t.t0) * FPS)) });
  });
  sceneStart += slot;
});
