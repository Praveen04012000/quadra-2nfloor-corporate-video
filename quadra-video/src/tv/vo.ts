// Voiceover placement and word cues for the Office TV film (ElevenLabs character timings in public/tv/vo/sNN.json).
// cue(scene, phrase) returns the absolute second the spoken phrase starts, so graphics land on the words.
import a01 from "../../public/tv/vo/s01.json";
import a02 from "../../public/tv/vo/s02.json";
import a03 from "../../public/tv/vo/s03.json";
import a04 from "../../public/tv/vo/s04.json";
import a05 from "../../public/tv/vo/s05.json";
import a06 from "../../public/tv/vo/s06.json";
import a07 from "../../public/tv/vo/s07.json";
import a08 from "../../public/tv/vo/s08.json";
import a09 from "../../public/tv/vo/s09.json";
import a10 from "../../public/tv/vo/s10.json";
import a11 from "../../public/tv/vo/s11.json";
import a12 from "../../public/tv/vo/s12.json";
import a13 from "../../public/tv/vo/s13.json";
import { TV_FPS, TV_SCENES } from "./script";

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
const ALIGN: Alignment[] = [a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13];

export const VO = TV_SCENES.map((s, i) => {
  const a = ALIGN[i];
  const len = a.character_end_times_seconds[a.character_end_times_seconds.length - 1];
  const slot = s.to - s.from;
  const lead = s.lead ?? Math.min(0.6, Math.max(0, (slot - len) * 0.3));
  return { no: s.no, src: `tv/vo/s${String(s.no).padStart(2, "0")}.mp3`, start: s.from + lead, len, text: a.characters.join(""), times: a.character_start_times_seconds };
});

export const cue = (scene: number, phrase: string, nth = 0): number => {
  const v = VO[scene - 1];
  let at = -1;
  for (let k = 0; k <= nth; k++) at = v.text.indexOf(phrase, at + 1);
  if (at < 0) throw new Error(`Cue "${phrase}" not found in scene ${scene}`);
  return v.start + v.times[at];
};

export const F = (t: number) => Math.round(t * TV_FPS);
