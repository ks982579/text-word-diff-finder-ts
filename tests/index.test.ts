import { compareTexts, visualizeDiff, DiffResult, Change } from '../src/index';

describe('compareTexts', () => {
  test('should identify removed words', () => {
    const baseText = "The quick brown fox jumps over the lazy dog";
    const updatedText = "The brown fox jumps over the dog";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(1); // "quick"
    expect(result.removedPositions).toContain(7); // "lazy"
    expect(result.addedPositions).toEqual([]);
  });

  test('should identify added words', () => {
    const baseText = "Hello world";
    const updatedText = "Hello beautiful world";

    const result = compareTexts(baseText, updatedText);

    expect(result.addedPositions).toContain(1); // "beautiful"
    expect(result.removedPositions).toEqual([]);
  });

  test('should identify both added and removed words', () => {
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

  test('should handle identical texts', () => {
    const text = "The quick brown fox";
    const result = compareTexts(text, text);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test('should handle empty strings', () => {
    expect(compareTexts("", "")).toEqual({
      removedPositions: [],
      addedPositions: []
    });

    expect(compareTexts("hello world", "")).toEqual({
      removedPositions: [0, 1],
      addedPositions: []
    });

    expect(compareTexts("", "hello world")).toEqual({
      removedPositions: [],
      addedPositions: [0, 1]
    });
  });

  test('should handle whitespace properly', () => {
    const baseText = "  hello   world  ";
    const updatedText = "hello world";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([]);
  });

  test('should handle complete text replacement', () => {
    const baseText = "original text here";
    const updatedText = "completely different content";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([0, 1, 2]);
    expect(result.addedPositions).toEqual([0, 1, 2]);
  });

  test('should handle single word changes', () => {
    const baseText = "cat";
    const updatedText = "dog";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([0]);
    expect(result.addedPositions).toEqual([0]);
  });

  test('should handle insertion at beginning', () => {
    const baseText = "world test";
    const updatedText = "hello world test";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([0]);
  });

  test('should handle insertion at end', () => {
    const baseText = "hello world";
    const updatedText = "hello world test";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toEqual([]);
    expect(result.addedPositions).toEqual([2]);
  });
});

describe('visualizeDiff', () => {
  test('should generate readable diff visualization', () => {
    const baseText = "The quick brown fox";
    const updatedText = "The fast brown fox";

    const visualization = visualizeDiff(baseText, updatedText);

    expect(visualization).toContain("[-quick]");
    expect(visualization).toContain("[+fast]");
    expect(visualization).toContain("The");
    expect(visualization).toContain("brown");
    expect(visualization).toContain("fox");
  });

  test('should handle texts with no changes', () => {
    const text = "unchanged text";
    const visualization = visualizeDiff(text, text);

    expect(visualization).not.toContain("[+");
    expect(visualization).not.toContain("[-");
    expect(visualization).toContain("unchanged");
    expect(visualization).toContain("text");
  });

  test('should show only additions', () => {
    const baseText = "hello world";
    const updatedText = "hello beautiful world";

    const visualization = visualizeDiff(baseText, updatedText);

    expect(visualization).toContain("[+beautiful]");
    expect(visualization).not.toContain("[-");
  });

  test('should show only removals', () => {
    const baseText = "hello beautiful world";
    const updatedText = "hello world";

    const visualization = visualizeDiff(baseText, updatedText);

    expect(visualization).toContain("[-beautiful]");
    expect(visualization).not.toContain("[+");
  });
});

describe('Edge cases and performance', () => {
  test('should handle very long texts efficiently', () => {
    const longText1 = Array(1000).fill("word").join(" ");
    const longText2 = Array(1000).fill("term").join(" ");

    const start = Date.now();
    const result = compareTexts(longText1, longText2);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000); // Should complete within 1 second
    expect(result.removedPositions).toHaveLength(1000);
    expect(result.addedPositions).toHaveLength(1000);
  });

  test('should handle special characters', () => {
    const baseText = "hello @world #test $money";
    const updatedText = "hello @universe #test $money";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(1); // "@world"
    expect(result.addedPositions).toContain(1); // "@universe"
  });

  test('should handle numbers', () => {
    const baseText = "version 1.0.0 is here";
    const updatedText = "version 2.0.0 is here";

    const result = compareTexts(baseText, updatedText);

    expect(result.removedPositions).toContain(1); // "1.0.0"
    expect(result.addedPositions).toContain(1); // "2.0.0"
  });
});