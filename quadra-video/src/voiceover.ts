// Pronunciation help for the voice only. Captions and on-screen text keep the script spelling.
// Replacements never add or remove sentence endings, so spoken and written sentences stay paired.
const SAY: [RegExp, string][] = [
  [/IntelliXperience/g, "Intelli-Experience"],
  [/IntelliAssure/g, "Intelli-Assure"],
  [/BluForge/g, "Blu-Forge"],
  [/AI-In-Residence/g, "A-I in Residence"],
];

export const spoken = (text: string) => SAY.reduce((t, [re, to]) => t.replace(re, to), text);

export const sentences = (text: string) => text.split(/(?<=[.!?])\s+/);
