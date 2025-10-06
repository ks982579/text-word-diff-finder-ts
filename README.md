# Text Word Diff Finder

[![npm version](https://badge.fury.io/js/@ks982579%2Ftext-word-diff-finder.svg)](https://badge.fury.io/js/@ks982579%2Ftext-word-diff-finder)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance TypeScript library for finding word-level differences between text strings using the Longest Common Subsequence (LCS) algorithm. Perfect for implementing diff viewers, change tracking, and text comparison features.

## Features

- 🚀 **Fast & Efficient**: Uses optimized LCS algorithm for accurate diff detection
- 📝 **Word-Level Granularity**: Identifies differences at word boundaries, not character level
- 🔧 **TypeScript Native**: Built with TypeScript, includes full type definitions
- 📦 **Universal**: Supports both ES modules and CommonJS
- 🧪 **Well Tested**: Comprehensive test suite with 100% coverage
- 📋 **Zero Dependencies**: Lightweight with no external dependencies
- 🎯 **Simple API**: Easy-to-use functions with clear return values

## Installation

```bash
npm install @ks982579/text-word-diff-finder
```

```bash
yarn add @ks982579/text-word-diff-finder
```

```bash
pnpm add @ks982579/text-word-diff-finder
```

## Quick Start

### ES Modules

```typescript
import { compareTexts, visualizeDiff } from "@ks982579/text-word-diff-finder";

const baseText = "The quick brown fox jumps over the lazy dog";
const updatedText = "The fast brown fox leaps over the sleepy dog";

const result = compareTexts(baseText, updatedText);
console.log(result);
// Output: {
//   removedPositions: [1, 4, 7],  // positions of "quick", "jumps", "lazy"
//   addedPositions: [1, 4, 7]     // positions of "fast", "leaps", "sleepy"
// }

// Generate a visual representation
console.log(visualizeDiff(baseText, updatedText));
```

### CommonJS

```javascript
const {
  compareTexts,
  visualizeDiff,
} = require("@ks982579/text-word-diff-finder");

const result = compareTexts("hello world", "hello beautiful world");
console.log(result);
// Output: { removedPositions: [], addedPositions: [1] }
```

## API Reference

### `compareTexts(baseText: string, updatedText: string, options?: CompareOptions): DiffResult`

Compares two text strings and returns the positions of added and removed words.

**Parameters:**

- `baseText` (string): The original text to compare against
- `updatedText` (string): The modified text to compare
- `options` (CompareOptions, optional): Configuration options for comparison behavior

**Returns:**

```typescript
interface DiffResult {
  removedPositions: number[]; // Array of word positions that were removed
  addedPositions: number[]; // Array of word positions that were added
}
```

**Example:**

```typescript
const result = compareTexts("The quick brown fox", "The slow brown fox");
// Returns: { removedPositions: [1], addedPositions: [1] }

// Case-insensitive comparison
const result2 = compareTexts("Hello World", "hello world", {
  ignoreCase: true,
});
// Returns: { removedPositions: [], addedPositions: [] }
```

### `visualizeDiff(baseText: string, updatedText: string, options?: CompareOptions): string`

Creates a human-readable visualization of the differences between two texts.

**Parameters:**

- `baseText` (string): The original text
- `updatedText` (string): The modified text
- `options` (CompareOptions, optional): Configuration options for comparison behavior

**Returns:**
A formatted string showing removals with `[-word]` and additions with `[+word]`.

**Example:**

```typescript
const visualization = visualizeDiff(
  "The quick brown fox",
  "The slow brown fox",
);
console.log(visualization);
// Output:
// Base text (- = removed):
// The [-quick] brown fox
//
// Updated text (+ = added):
// The [+slow] brown fox
```

### Type Definitions

```typescript
export interface DiffResult {
  removedPositions: number[];
  addedPositions: number[];
}

export interface CompareOptions {
  ignoreCase?: boolean; // Default: false
}

export interface Change {
  type: "added" | "removed" | "unchanged";
  word: string;
  baseIndex?: number;
  updatedIndex?: number;
}
```

## Use Cases

### 1. Document Version Comparison

```typescript
const originalDoc = "Version 1.0 includes basic features";
const revisedDoc = "Version 2.0 includes advanced features and bug fixes";

const changes = compareTexts(originalDoc, revisedDoc);
// Identify what changed between document versions
```

### 2. Real-time Collaborative Editing

```typescript
function trackChanges(originalText: string, newText: string) {
  const diff = compareTexts(originalText, newText);
  return {
    hasChanges:
      diff.removedPositions.length > 0 || diff.addedPositions.length > 0,
    changeCount: diff.removedPositions.length + diff.addedPositions.length,
    visualization: visualizeDiff(originalText, newText),
  };
}
```

### 3. Content Moderation

```typescript
const originalComment = "This is a great post about programming";
const editedComment = "This is an amazing post about web development";

const changes = compareTexts(originalComment, editedComment);
// Track what users changed in their comments
```

## Algorithm Details

This library implements the **Longest Common Subsequence (LCS)** algorithm, which is the same approach used by popular diff tools like Git. The algorithm:

1. **Tokenizes** both texts into word arrays (splitting on whitespace)
2. **Builds an LCS matrix** to find the optimal alignment
3. **Backtracks** through the matrix to identify specific changes
4. **Returns word positions** for removed and added content

**Time Complexity:** O(m × n) where m and n are the number of words in each text
**Space Complexity:** O(m × n) for the LCS matrix

## Performance

The library is optimized for real-world usage:

- ✅ Handles texts with **1000+ words** efficiently (< 1 second)
- ✅ Memory-efficient implementation
- ✅ No memory leaks or unnecessary allocations
- ✅ Suitable for real-time applications

## Browser Support

- ✅ Modern browsers (ES2020+)
- ✅ Node.js 16+
- ✅ TypeScript 4.5+
- ✅ Both ES modules and CommonJS

## Development

### Building from Source

```bash
git clone https://github.com/ksull18/text-word-diff-finder-ts.git
cd text-word-diff-finder-ts
npm install
npm run build
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Scripts

- `npm run build` - Build for production (CommonJS + ES modules + types)
- `npm run lint` - Type checking
- `npm run clean` - Remove build artifacts
- `npm test` - Run test suite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for your changes
4. Ensure tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 0.1.0

- Initial release
- Core LCS-based diff algorithm
- TypeScript support with full type definitions
- Comprehensive test suite
- Support for both ES modules and CommonJS
- Visual diff representation
- Zero external dependencies

## Related Projects

- [diff](https://www.npmjs.com/package/diff) - A more comprehensive text diffing library
- [fast-diff](https://www.npmjs.com/package/fast-diff) - Character-level diffing
- [jsdiff](https://www.npmjs.com/package/jsdiff) - JavaScript text diffing implementation

---

Made by [Kevin Sullivan](https://github.com/ks982579)
