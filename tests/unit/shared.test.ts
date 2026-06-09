import { describe, it, expect } from "vitest";
import { LOCALES, FREE_DAILY_LIMIT, PRICING_TIERS } from "../../shared/constants";
import { generateId, truncateText, formatDate, stripJsonFences } from "../../shared/utils";
import { validateResumeInput } from "../../shared/validators";

describe("shared constants", () => {
  it("has correct locales", () => {
    const codes = LOCALES.map((l) => l.code);
    expect(codes).toContain("zh-CN");
    expect(codes).toContain("en");
  });

  it("has daily limit", () => {
    expect(FREE_DAILY_LIMIT).toBe(3);
  });

  it("has pricing tiers", () => {
    expect(PRICING_TIERS).toHaveLength(2);
    expect(PRICING_TIERS[0].nameKey).toBe("pricing.free.name");
    expect(PRICING_TIERS[1].nameKey).toBe("pricing.pro.name");
    expect(PRICING_TIERS[0].isPro).toBe(false);
    expect(PRICING_TIERS[1].isPro).toBe(true);
  });
});

describe("shared utils", () => {
  it("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBe(9);
  });

  it("truncates text", () => {
    expect(truncateText("Hello world", 5)).toBe("Hello...");
    expect(truncateText("Hi", 5)).toBe("Hi");
  });

  it("formats dates", () => {
    expect(formatDate("2024-01-15T00:00:00Z")).toBe("2024-01-15");
    expect(formatDate("")).toBe("");
  });

  it("strips JSON fences", () => {
    expect(stripJsonFences('```json\n{"a":1}\n```')).toBe('{"a":1}');
    expect(stripJsonFences('{"a":1}')).toBe('{"a":1}');
  });
});

describe("shared validators", () => {
  it("validates valid input", () => {
    const result = validateResumeInput("My resume content with enough characters");
    expect(result.valid).toBe(true);
  });

  it("rejects empty input", () => {
    const result = validateResumeInput("");
    expect(result.valid).toBe(false);
  });

  it("rejects too-short input", () => {
    const result = validateResumeInput("short");
    expect(result.valid).toBe(false);
  });
});
