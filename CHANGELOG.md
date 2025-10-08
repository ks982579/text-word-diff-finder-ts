# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features

- **Word-level change detection**: Detect modifications within words (capitalization, pluralization, typos) rather than treating them as complete replacements
- **Similarity scoring**: Implement fuzzy matching to identify similar words (e.g., "cat" vs "cats", "color" vs "colour")
- **Multiple diff algorithms**: Support for different algorithms based on use case and performance requirements
- **Custom word tokenization**: Allow custom regex patterns for word splitting
- **Diff context**: Provide surrounding context for changes
- **Character-level fallback**: For detected word changes, show character-level differences

### Algorithm Options (Future Roadmap)

Different algorithms excel in different scenarios:

- **Longest Common Subsequence (LCS)** _(current)_: Optimal for accuracy, moderate performance O(m×n)
- **Myers' Algorithm**: Fast linear space diff, better for large files O(n+d²) where d is edit distance
- **Patience Diff**: Better handling of moved blocks, used by Git for some cases
- **Hunt-McIlroy Algorithm**: Classic Unix diff algorithm, good balance of speed and accuracy
- **Levenshtein Distance**: Character-level edit distance, useful for word similarity scoring
- **Jaro-Winkler Distance**: String similarity for fuzzy matching and typo detection
- **Rolling Hash (Rabin-Karp)**: For finding moved text blocks efficiently
- **Suffix Array/Tree**: For very large documents with repeated patterns

**Planned Algorithm Support:**

- v0.4.0: Myers' Algorithm for performance-critical applications
- v0.5.0: Patience Diff for better moved-block detection
- v0.6.0: Configurable algorithm selection based on input characteristics

### Ideas for Future Versions

- Support for multiple text formats (Markdown, HTML)
- Integration with popular diff libraries
- Streaming diff for very large documents
- Support for ignoring certain word patterns (e.g., timestamps, IDs)
- Undo/redo change tracking
- Collaborative editing conflict resolution
- Automatic algorithm selection based on text characteristics

## [0.3.0] - 2025-10-08

### Added

- **HTML Formatting API**: New `formatDiffAsHtml()` function for browser environments
  - Generates styled HTML with highlighted differences using DOM APIs
  - Supports custom CSS class names for easy styling integration
  - Configurable background colors for highlighting
  - Optional line-through decoration for removed words
  - Pass-through support for `ignoreCase` option
- **Comprehensive XSS Protection**: Enterprise-grade security measures
  - Automatic HTML entity escaping via `textContent` property
  - Class name sanitization to prevent attribute injection attacks
  - Protection against 12+ attack vectors (script injection, event handlers, data URIs, etc.)
  - 13 dedicated security tests covering XSS scenarios
- **Type Definitions**: Three new exported interfaces
  - `HtmlFormatOptions`: Configuration for HTML formatting
  - `WordStyleOptions`: Styling options for added/removed words
  - Full TypeScript support with DOM type integration

### Changed

- **TypeScript Configuration**: Added DOM library for browser API support
  - Updated `tsconfig.json` to include DOM types
  - Maintains compatibility with Node.js environments
- **Implementation Approach**: Refactored from string concatenation to programmatic DOM manipulation
  - Uses `document.createElement()` and `document.createTextNode()`
  - More maintainable and type-safe implementation
  - Better performance for complex HTML generation

### Security

- **XSS Prevention**: Comprehensive protection against cross-site scripting
  - Script tag injection blocked
  - Event handler injection blocked (`onerror`, `onload`, etc.)
  - JavaScript protocol blocked (`javascript:`)
  - Data URI XSS blocked
  - SVG-based XSS blocked
  - iframe injection blocked
  - HTML entity double-encoding attacks prevented
  - Null byte injection handled
  - Attribute breakout attempts blocked
  - Class name injection sanitized

### Technical Details

- **Browser-Only Function**: `formatDiffAsHtml()` requires browser environment
  - Throws descriptive error when called in Node.js
  - Runtime environment detection via `typeof document`
- **Default Styling**:
  - Added words: Light green background (`#90EE90`), class `diff-added`
  - Removed words: Light pink background (`#FFB6C1`), class `diff-removed`, line-through decoration
- **Customization Options**:
  - `applyHighlighting`: Toggle background colors (default: true)
  - `highlightColor`: Custom hex/rgb colors
  - `className`: Custom CSS classes for styling hooks
  - `applyLineThrough`: Toggle strikethrough text (default: true for removed, false for added)
- **Test Coverage**: Added 16 new tests (45 → 58 total)
  - HTML generation with various styling options
  - XSS security validation
  - Environment detection
  - Edge cases (empty strings, special characters, etc.)

### Documentation

- Updated implementation to use modern DOM APIs
- Added comprehensive security documentation
- JSDoc comments with `@throws` annotation for environment errors

### Example Usage

```typescript
import { formatDiffAsHtml } from "@ks982579/text-word-diff-finder";

const html = formatDiffAsHtml("The quick brown fox", "The fast brown fox", {
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
});
// Returns: The <span class="my-removal" style="...">quick</span> <span class="my-addition" style="...">fast</span> brown fox
```

## [0.2.0] - 2025-10-06

### Added

- **Case-Insensitive Comparison**: New `CompareOptions` interface with `ignoreCase` option
  - `compareTexts()` now accepts optional third parameter for configuration
  - `visualizeDiff()` now accepts optional third parameter for configuration
  - Words are compared case-insensitively when `{ ignoreCase: true }` is passed
  - Default behavior remains case-sensitive for backward compatibility
- **Enhanced Type Definitions**: Exported `CompareOptions` interface
- **Comprehensive Test Coverage**: Added 11 new tests covering case-insensitive functionality
  - Mixed case matching scenarios
  - Edge cases with empty strings and uppercase/lowercase
  - Performance validation with case-insensitive enabled
  - Integration tests with `visualizeDiff()`

### Changed

- Updated `compareTexts()` signature to accept optional `CompareOptions` parameter
- Updated `visualizeDiff()` signature to accept optional `CompareOptions` parameter
- Enhanced internal `computeLCS()` function with configurable word comparison logic

### Technical Details

- Implemented efficient case-insensitive comparison using `toLowerCase()` only when needed
- No performance degradation when using default case-sensitive mode
- Maintains O(m × n) time complexity for both case-sensitive and case-insensitive modes
- Full backward compatibility - all existing code continues to work without changes

### Documentation

- Updated README.md with case-insensitive examples
- Added `CompareOptions` to type definitions documentation
- Updated API reference with new optional parameters

## [0.1.0] - 2025-09-28

### Added

- **Core LCS Algorithm**: Implemented Longest Common Subsequence algorithm for accurate word-level diff detection
- **TypeScript Support**: Full TypeScript implementation with comprehensive type definitions
- **Dual Module Support**: Compatible with both ES modules and CommonJS
- **Main API Functions**:
  - `compareTexts()`: Returns positions of added and removed words
  - `visualizeDiff()`: Generates human-readable diff visualization
- **Comprehensive Testing**: 18 test cases covering edge cases and performance
- **Build Pipeline**: Multi-target compilation (ES modules, CommonJS, TypeScript definitions)
- **Professional Documentation**: Complete README with examples, API reference, and use cases
- **Zero Dependencies**: Lightweight implementation with no external dependencies

### Technical Details

- **Algorithm**: O(m × n) time complexity LCS implementation
- **Performance**: Handles 1000+ word texts efficiently (< 1 second)
- **Browser Support**: ES2020+, Node.js 16+
- **Case Sensitivity**: Currently performs case-sensitive word comparisons
- **Word Tokenization**: Splits on whitespace using `/\s+/` regex

### Project Setup

- Proper npm package configuration for publication
- Jest testing framework with coverage reporting
- Multi-target TypeScript compilation
- Comprehensive `.gitignore` for Node.js/TypeScript projects
- MIT License
- Professional project structure with `src/` and `tests/` directories

### Current Limitations

- **Case Sensitive**: "Word" and "word" are treated as completely different
- **No Fuzzy Matching**: "cat" vs "cats" are treated as unrelated words
- **Binary Word Changes**: Words are either identical or completely different
- **Whitespace Only**: Uses simple regex for word boundaries
- **No Change Context**: Doesn't provide surrounding text context

---

## Contributing to the Changelog

When adding entries:

- Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Use semantic versioning for releases
- Group changes by type: Added, Changed, Deprecated, Removed, Fixed, Security
- Include breaking changes in ### BREAKING CHANGES section
- Reference issue numbers when applicable
- Keep entries concise but descriptive

## Version Planning

### v0.4.0 (Next Minor Release)

Focus on Myers' Algorithm for performance-critical applications and custom word tokenization

### v0.5.0

Focus on word-level change detection, Patience Diff, and character-level fallback

### v1.0.0 (Stable Release)

Feature-complete with all core functionality, multiple algorithms, performance optimized
