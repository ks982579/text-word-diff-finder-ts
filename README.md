# Text Word Diff Finder

[![npm version](https://badge.fury.io/js/@ks982579%2Ftext-word-diff-finder.svg)](https://badge.fury.io/js/@ks982579%2Ftext-word-diff-finder)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance TypeScript library for finding word-level differences between text strings using the Longest Common Subsequence (LCS) algorithm. Perfect for implementing diff viewers, change tracking, and text comparison features.

## Features

- 🚀 **Fast & Efficient**: Uses optimized LCS algorithm for accurate diff detection
- 📝 **Word-Level Granularity**: Identifies differences at word boundaries, not character level
- 🎨 **HTML Formatting**: Generate styled HTML output with customizable highlighting (browser-only)
- 🔒 **XSS Protected**: Enterprise-grade security with comprehensive protection against injection attacks
- 🔧 **TypeScript Native**: Built with TypeScript, includes full type definitions
- 📦 **Universal**: Supports both ES modules and CommonJS
- 🧪 **Well Tested**: Comprehensive test suite with 58 passing tests
- 📋 **Zero Dependencies**: Lightweight with no external dependencies
- 🎯 **Simple API**: Easy-to-use functions with clear return values
- 🎭 **Case-Insensitive Option**: Optional case-insensitive text comparison

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

### `formatDiffAsHtml(baseText: string, updatedText: string, options?: HtmlFormatOptions): string`

**⚠️ Browser Only**: This function requires a browser environment with the DOM API.

Generates styled HTML output with highlighted differences. Perfect for displaying diffs in web applications.

**Parameters:**

- `baseText` (string): The original text
- `updatedText` (string): The modified text
- `options` (HtmlFormatOptions, optional): Configuration for HTML formatting and styling

**Returns:**
HTML string with `<span>` elements for changed words, including CSS classes and inline styles.

**Example:**

```typescript
import { formatDiffAsHtml } from "@ks982579/text-word-diff-finder";

const html = formatDiffAsHtml(
  "The quick brown fox",
  "The fast brown fox",
  {
    ignoreCase: false,
    addedStyle: {
      className: "my-addition",
      highlightColor: "#90EE90",
      applyHighlighting: true,
      applyLineThrough: false,
    },
    removedStyle: {
      className: "my-removal",
      highlightColor: "#FFB6C1",
      applyHighlighting: true,
      applyLineThrough: true,
    },
  }
);

document.getElementById("diff-output").innerHTML = html;
// Output: The <span class="my-removal" style="background-color: #FFB6C1; text-decoration: line-through">quick</span>
//         <span class="my-addition" style="background-color: #90EE90">fast</span> brown fox
```

**Default Styling:**

- **Added words**: Light green background (`#90EE90`), class `diff-added`
- **Removed words**: Light pink background (`#FFB6C1`), class `diff-removed`, line-through

**Security:**

This function includes comprehensive XSS protection:
- Automatic HTML entity escaping via DOM APIs
- Class name sanitization to prevent attribute injection
- Safe handling of malicious input

### Type Definitions

```typescript
export interface DiffResult {
  removedPositions: number[];
  addedPositions: number[];
}

export interface CompareOptions {
  ignoreCase?: boolean; // Default: false
}

export interface HtmlFormatOptions {
  ignoreCase?: boolean; // Pass-through to compareTexts
  addedStyle?: WordStyleOptions;
  removedStyle?: WordStyleOptions;
  showRemoved?: boolean; // Default: true - Toggle highlighting of removed words
  showAdded?: boolean; // Default: true - Toggle highlighting of added words
}

export interface WordStyleOptions {
  applyHighlighting?: boolean; // Default: true
  highlightColor?: string; // Default: "#90EE90" (added), "#FFB6C1" (removed)
  className?: string; // Default: "diff-added" or "diff-removed"
  applyLineThrough?: boolean; // Default: false (added), true (removed)
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

### 2. Side-by-Side Diff Viewer

```typescript
import { formatDiffAsHtml } from "@ks982579/text-word-diff-finder";

// In your React/Vue/Angular component
function SideBySideDiffViewer({ original, modified }) {
  // Left side - show only removals
  const leftHtml = formatDiffAsHtml(original, modified, {
    showAdded: false,
    removedStyle: { highlightColor: "#FFB6C1" }
  });

  // Right side - show only additions
  const rightHtml = formatDiffAsHtml(original, modified, {
    showRemoved: false,
    addedStyle: { highlightColor: "#90EE90" }
  });

  return (
    <div className="diff-container">
      <div className="diff-left" dangerouslySetInnerHTML={{ __html: leftHtml }} />
      <div className="diff-right" dangerouslySetInnerHTML={{ __html: rightHtml }} />
    </div>
  );
}
```

### 3. Real-time Collaborative Editing

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

### 4. Content Moderation

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
- ✅ Node.js 16+ (HTML formatting requires browser environment)
- ✅ TypeScript 4.5+
- ✅ Both ES modules and CommonJS

**Note**: The `formatDiffAsHtml()` function is browser-only and requires the DOM API. Other functions work in both Node.js and browser environments.

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

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## Related Projects

- [diff](https://www.npmjs.com/package/diff) - A more comprehensive text diffing library
- [fast-diff](https://www.npmjs.com/package/fast-diff) - Character-level diffing
- [jsdiff](https://www.npmjs.com/package/jsdiff) - JavaScript text diffing implementation

---

Made by [Kevin Sullivan](https://github.com/ks982579)
