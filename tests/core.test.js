import { describe, it, expect } from "vitest";
import {
  CARD_THEMES,
  DEFAULT_THEME,
  themeClassName,
  mergeRows,
  sliceRange,
  filterRowByCols,
  matchSearch,
  resolveQRData,
  isValidWidth,
  isValidHeight,
} from "../src/core/core.js";

describe("themeClassName", () => {
  it("returns the class for a known theme", () => {
    expect(themeClassName("ocean")).toBe("theme-ocean");
  });

  it("falls back to the default theme for unknown keys", () => {
    expect(themeClassName("does-not-exist")).toBe(`theme-${DEFAULT_THEME}`);
    expect(themeClassName(undefined)).toBe(`theme-${DEFAULT_THEME}`);
  });

  it("exposes a default theme that is part of the list", () => {
    expect(CARD_THEMES.some((theme) => theme.key === DEFAULT_THEME)).toBe(true);
  });
});

describe("mergeRows", () => {
  it("merges rows sharing the same key column", () => {
    const data = [
      ["Ali", "Math"],
      ["Ali", "Science"],
      ["Sara", "Art"],
    ];
    const result = mergeRows(data, 0);
    expect(result).toEqual([
      ["Ali", "Math, Science"],
      ["Sara", "Art"],
    ]);
  });

  it("does not mutate the source data", () => {
    const data = [
      ["Ali", "Math"],
      ["Ali", "Science"],
    ];
    const snapshot = JSON.parse(JSON.stringify(data));
    mergeRows(data, 0);
    expect(data).toEqual(snapshot);
  });

  it("does not duplicate identical values when merging", () => {
    const data = [
      ["Ali", "Math"],
      ["Ali", "Math"],
    ];
    expect(mergeRows(data, 0)).toEqual([["Ali", "Math"]]);
  });
});

describe("sliceRange", () => {
  const data = [["a"], ["b"], ["c"], ["d"]];

  it("slices using a 1-based inclusive range", () => {
    expect(sliceRange(data, 2, 3)).toEqual([["b"], ["c"]]);
  });

  it("falls back to the full data set for invalid input", () => {
    expect(sliceRange(data, "", "")).toEqual(data);
  });

  it("clamps a start below 1", () => {
    expect(sliceRange(data, 0, 2)).toEqual([["a"], ["b"]]);
  });
});

describe("filterRowByCols", () => {
  it("keeps only the selected column indices", () => {
    expect(filterRowByCols(["a", "b", "c"], [0, 2])).toEqual(["a", "c"]);
  });

  it("returns an empty array when nothing is selected", () => {
    expect(filterRowByCols(["a", "b"], [])).toEqual([]);
  });
});

describe("matchSearch", () => {
  it("matches case-insensitively", () => {
    expect(matchSearch("Hello World", "hello")).toBe(true);
  });

  it("treats the query literally (no regex)", () => {
    expect(matchSearch("a.b", "a.b")).toBe(true);
    expect(matchSearch("axb", "a.b")).toBe(false);
    expect(matchSearch("price (USD)", "(USD)")).toBe(true);
  });

  it("matches everything for an empty query", () => {
    expect(matchSearch("anything", "")).toBe(true);
  });
});

describe("resolveQRData", () => {
  const values = ["Ali", "ali@example.com", "Tehran"];
  const labels = ["Name", "Email", "City"];

  it("uses a column value when the input matches a label (non-final column)", () => {
    expect(resolveQRData(values, labels, "Email")).toBe("ali@example.com");
  });

  it("uses the column value for the last column too", () => {
    expect(resolveQRData(values, labels, "City")).toBe("Tehran");
  });

  it("uses the raw input when it is not a column label", () => {
    expect(resolveQRData(values, labels, "https://example.com")).toBe(
      "https://example.com",
    );
  });
});

describe("isValidWidth / isValidHeight", () => {
  it("validates width within bounds", () => {
    expect(isValidWidth(600, 1920)).toBe(true);
    expect(isValidWidth(100, 1920)).toBe(false);
    expect(isValidWidth(5000, 1920)).toBe(false);
    expect(isValidWidth("", 1920)).toBe(false);
  });

  it("validates height within bounds", () => {
    expect(isValidHeight(110, 1080)).toBe(true);
    expect(isValidHeight(50, 1080)).toBe(false);
    expect(isValidHeight("abc", 1080)).toBe(false);
  });
});
