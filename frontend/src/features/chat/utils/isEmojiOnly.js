const MAX_EMOJI_GRAPHEMES = 8;

function countGraphemes(text) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...segmenter.segment(text)].length;
  }
  return [...text].length;
}

export function isEmojiOnly(text) {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/[\p{L}\p{N}]/u.test(trimmed)) return false;
  if (!/\p{Extended_Pictographic}/u.test(trimmed)) return false;
  return countGraphemes(trimmed.replace(/\s/g, "")) <= MAX_EMOJI_GRAPHEMES;
}
