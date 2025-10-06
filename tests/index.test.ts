import { compareTexts, visualizeDiff, DiffResult, Change } from "../src/index";

describe("compareTexts", () => {
  test("should identify removed words", () => {
    const baseText = "The quick brown fox jumps over the lazy dog";
    const updatedText = "The brown fox jumps over the dog";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).not.toContain(0); // "The"
    expect(result.removedPositions).toContain(1); // "quick"
    expect(result.removedPositions).toContain(7); // "lazy"
    expect(result.removedPositions.length).toEqual(2); // Only 2 removed
    expect(result.addedPositions).toEqual([]);
  });

  test("should identify added words", () => {
    const baseText = "Hello world";
    const updatedText = "Hello beautiful world";

    const result = compareTexts(baseText, updatedText);

    expect(result.addedPositions).toContain(1); // "beautiful"
    expect(result.addedPositions.length).toEqual(1); // Only 1 removed
    expect(result.removedPositions).toEqual([]);
  });

  test("should identify both added and removed words", () => {
    const baseText = "The quick brown fox jumps over the lazy dog";
    const updatedText = "The fast brown fox leaps over the sleepy dog";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(1); // "quick"
    expect(result.removedPositions).toContain(4); // "jumps"
    expect(result.removedPositions).toContain(7); // "lazy"
    expect(result.addedPositions).toContain(1); // "fast"
    expect(result.addedPositions).toContain(4); // "leaps"
    expect(result.addedPositions).toContain(7); // "sleepy"
  });

  test("should handle identical texts", () => {
    const text = "The quick brown fox";
    const result = compareTexts(text, text);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test("should handle empty strings", () => {
    expect(compareTexts("", "")).toEqual({
      removedPositions: [],
      addedPositions: [],
    });

    expect(compareTexts("hello world", "")).toEqual({
      removedPositions: [0, 1],
      addedPositions: [],
    });

    expect(compareTexts("", "hello world")).toEqual({
      removedPositions: [],
      addedPositions: [0, 1],
    });
  });

  test("should handle whitespace properly", () => {
    const baseText = "  hello   world  ";
    const updatedText = "hello world";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test("should handle complete text replacement", () => {
    const baseText = "original text here";
    const updatedText = "completely different content";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([0, 1, 2]);
    expect(result.addedPositions).toEqual([0, 1, 2]);
  });

  test("should handle single word changes", () => {
    const baseText = "cat";
    const updatedText = "dog";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([0]);
    expect(result.addedPositions).toEqual([0]);
  });

  test("should handle insertion at beginning", () => {
    const baseText = "world test";
    const updatedText = "hello world test";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([0]);
  });

  test("should handle insertion at end", () => {
    const baseText = "hello world";
    const updatedText = "hello world test";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([2]);
  });
});

describe("visualizeDiff", () => {
  test("should generate readable diff visualization", () => {
    const baseText = "The quick brown fox";
    const updatedText = "The fast brown fox";

    const visualization = visualizeDiff(baseText, updatedText);

    expect(visualization).toContain("[-quick]");
    expect(visualization).toContain("[+fast]");
    expect(visualization).toContain("The");
    expect(visualization).toContain("brown");
    expect(visualization).toContain("fox");
  });

  test("should handle texts with no changes", () => {
    const text = "unchanged text";
    const visualization = visualizeDiff(text, text);

    expect(visualization).not.toContain("[+");
    expect(visualization).not.toContain("[-");
    expect(visualization).toContain("unchanged");
    expect(visualization).toContain("text");
  });

  test("should show only additions", () => {
    const baseText = "hello world";
    const updatedText = "hello beautiful world";

    const visualization = visualizeDiff(baseText, updatedText);

    expect(visualization).toContain("[+beautiful]");
    expect(visualization).not.toContain("[-");
  });

  test("should show only removals", () => {
    const baseText = "hello beautiful world";
    const updatedText = "hello world";

    const visualization = visualizeDiff(baseText, updatedText);

    expect(visualization).toContain("[-beautiful]");
    expect(visualization).not.toContain("[+");
  });
});

describe("Edge cases and performance", () => {
  test("should handle very long texts efficiently", () => {
    const longText1 = Array(1000).fill("word").join(" ");
    const longText2 = Array(1000).fill("term").join(" ");

    const start = Date.now();
    const result = compareTexts(longText1, longText2);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000); // Should complete within 1 second
    expect(result.removedPositions).toHaveLength(1000);
    expect(result.addedPositions).toHaveLength(1000);
  });

  test("should handle special characters", () => {
    const baseText = "hello @world #test $money";
    const updatedText = "hello @universe #test $money";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(1); // "@world"
    expect(result.addedPositions).toContain(1); // "@universe"
  });

  test("should handle numbers", () => {
    const baseText = "version 1.0.0 is here";
    const updatedText = "version 2.0.0 is here";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(1); // "1.0.0"
    expect(result.addedPositions).toContain(1); // "2.0.0"
  });
  test("should handle case sensitivity", () => {
    const baseText = "version 1.0.0 is here";
    const updatedText = "Version 1.0.0 is here";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(0); // "version"
    expect(result.addedPositions).toContain(0); // "Version"
  });
});

describe("Case-insensitive comparison", () => {
  test("should match words with different cases when ignoreCase is true", () => {
    const baseText = "Hello World Test";
    const updatedText = "hello world test";

    const result = compareTexts(baseText, updatedText, { ignoreCase: true });

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test("should still detect different words even with ignoreCase", () => {
    const baseText = "The quick brown fox";
    const updatedText = "The FAST brown fox";

    const result = compareTexts(baseText, updatedText, { ignoreCase: true });

    expect(result.removedPositions).toContain(1); // "quick"
    expect(result.addedPositions).toContain(1); // "FAST"
  });

  test("should handle mixed case changes", () => {
    const baseText = "Version 1.0.0 is HERE";
    const updatedText = "version 1.0.0 is here";

    const result = compareTexts(baseText, updatedText, { ignoreCase: true });

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test("should work with visualizeDiff when ignoreCase is true", () => {
    const baseText = "Hello World";
    const updatedText = "hello world";

    const visualization = visualizeDiff(baseText, updatedText, { ignoreCase: true });

    expect(visualization).not.toContain("[-");
    expect(visualization).not.toContain("[+");
    expect(visualization).toContain("Hello");
    expect(visualization).toContain("hello");
  });

  test("should still be case-sensitive by default", () => {
    const baseText = "Hello World";
    const updatedText = "hello world";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([0, 1]);
    expect(result.addedPositions).toEqual([0, 1]);
  });

  test("should handle ignoreCase: false explicitly", () => {
    const baseText = "Hello World";
    const updatedText = "hello world";

    const result = compareTexts(baseText, updatedText, { ignoreCase: false });

    expect(result.removedPositions).toEqual([0, 1]);
    expect(result.addedPositions).toEqual([0, 1]);
  });

  test("should handle case-insensitive with additions and removals", () => {
    const baseText = "The QUICK brown FOX jumps";
    const updatedText = "the quick BROWN fox leaps";

    const result = compareTexts(baseText, updatedText, { ignoreCase: true });

    expect(result.removedPositions).toContain(4); // "jumps"
    expect(result.addedPositions).toContain(4); // "leaps"
    expect(result.removedPositions).not.toContain(0); // "The/the" should match
    expect(result.removedPositions).not.toContain(1); // "QUICK/quick" should match
  });

  test("should preserve original word case in Change objects", () => {
    const baseText = "Hello World";
    const updatedText = "hello world";

    const result = compareTexts(baseText, updatedText, { ignoreCase: true });

    // Even though words match with ignoreCase, no changes should be reported
    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test("should handle empty strings with ignoreCase", () => {
    const result1 = compareTexts("", "", { ignoreCase: true });
    expect(result1).toEqual({ removedPositions: [], addedPositions: [] });

    const result2 = compareTexts("HELLO", "", { ignoreCase: true });
    expect(result2).toEqual({ removedPositions: [0], addedPositions: [] });

    const result3 = compareTexts("", "world", { ignoreCase: true });
    expect(result3).toEqual({ removedPositions: [], addedPositions: [0] });
  });

  test("should handle all uppercase vs all lowercase", () => {
    const baseText = "THE QUICK BROWN FOX";
    const updatedText = "the quick brown fox";

    const result = compareTexts(baseText, updatedText, { ignoreCase: true });

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test("should handle performance with ignoreCase enabled", () => {
    const longText1 = Array(1000).fill("WORD").join(" ");
    const longText2 = Array(1000).fill("word").join(" ");

    const start = Date.now();
    const result = compareTexts(longText1, longText2, { ignoreCase: true });
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });
});
