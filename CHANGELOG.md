# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features

- **Case-insensitive comparison option**: Add optional parameter to make word comparisons case-insensitive
- **Word-level change detection**: Detect modifications within words (capitalization, pluralization, typos) rather than treating them as complete replacements
- **Similarity scoring**: Implement fuzzy matching to identify similar words (e.g., "cat" vs "cats", "color" vs "colour")
- **Multiple diff algorithms**: Support for different algorithms based on use case and performance requirements
- **Custom word tokenization**: Allow custom regex patterns for word splitting
- **Diff context**: Provide surrounding context for changes
- **HTML output formatter**: Generate HTML with highlighted changes
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

### v0.2.0 (Next Minor Release)

Focus on case-insensitive options and basic word similarity

### v0.3.0

Focus on word-level change detection and character-level fallback

### v1.0.0 (Stable Release)

Feature-complete with all core functionality, performance optimized
