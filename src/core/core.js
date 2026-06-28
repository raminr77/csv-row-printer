/**
 * Pure, DOM-free logic for CSV Row Printer.
 *
 * Everything here is side-effect free so it can be unit tested in isolation
 * (see tests/core.test.js) and reused by the DOM layer in src/functions/*.
 */

/** Available card color themes. `key` maps to a `.theme-<key>` CSS class. */
export const CARD_THEMES = [
  { key: "default", label: "Default" },
  { key: "ocean", label: "Ocean" },
  { key: "sunset", label: "Sunset" },
  { key: "forest", label: "Forest" },
  { key: "grape", label: "Grape" },
  { key: "slate", label: "Slate (Dark)" },
];

export const DEFAULT_THEME = "default";

/** CSS class applied to a card for a given theme key. */
export function themeClassName(themeKey) {
  const isKnown = CARD_THEMES.some((theme) => theme.key === themeKey);
  return `theme-${isKnown ? themeKey : DEFAULT_THEME}`;
}

/**
 * Group rows by the value of `colIndex`. Rows sharing the same key are merged:
 * differing cells are concatenated with ", ".
 *
 * The input rows are never mutated (each kept row is copied first), which fixes
 * the original bug where re-selecting a merge column corrupted the source data.
 */
export function mergeRows(data, colIndex) {
  const keyToResultIndex = new Map();
  const result = [];

  data.forEach((row) => {
    const key = row[colIndex];
    if (keyToResultIndex.has(key)) {
      const target = result[keyToResultIndex.get(key)];
      row.forEach((cell, index) => {
        const existing = target[index];
        if (cell === existing) return;
        // Avoid appending a value we already merged in.
        const parts = String(existing).split(", ");
        if (!parts.includes(String(cell))) {
          target[index] = `${existing}, ${cell}`;
        }
      });
    } else {
      keyToResultIndex.set(key, result.length);
      result.push([...row]);
    }
  });

  return result;
}

/**
 * Slice rows by a 1-based inclusive range. Invalid / empty inputs fall back to
 * the full data set.
 */
export function sliceRange(data, start, end) {
  const parsedStart = parseInt(start, 10);
  const parsedEnd = parseInt(end, 10);
  const from = Number.isNaN(parsedStart) ? 0 : Math.max(0, parsedStart - 1);
  const to = Number.isNaN(parsedEnd) ? data.length : parsedEnd;
  return data.slice(from, to);
}

/** Keep only the cells whose column index is in `selectedCols`. */
export function filterRowByCols(row, selectedCols) {
  return row.filter((_cell, index) => selectedCols.includes(index));
}

/**
 * Case-insensitive, literal (non-regex) substring match. An empty query
 * matches everything.
 */
export function matchSearch(text, query) {
  if (!query) return true;
  return String(text).toLowerCase().includes(String(query).toLowerCase());
}

/**
 * Resolve the QR payload for a card.
 *
 * If `qrInput` exactly matches one of the card's column labels, the value of
 * that column is used; otherwise the raw `qrInput` text is used as-is. This
 * fixes the original bug where a non-final matching column was overwritten.
 */
export function resolveQRData(values, labels, qrInput) {
  const matchIndex = labels.indexOf(qrInput);
  if (matchIndex !== -1) return values[matchIndex];
  return qrInput;
}

/** Validate the card width against allowed bounds. */
export function isValidWidth(value, maxWidth) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 200 && num <= maxWidth;
}

/** Validate the card min-height against allowed bounds. */
export function isValidHeight(value, maxHeight) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 110 && num <= maxHeight;
}
