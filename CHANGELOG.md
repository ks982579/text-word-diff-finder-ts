# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- **Case-insensitive comparison option**: Add optional parameter to make word comparisons case-insensitive
- **Word-level change detection**: Detect modifications within words (capitalization, pluralization, typos) rather than treating them as complete replacements
- **Similarity scoring**: Implement fuzzy matching to identify similar words (e.g., "cat" vs "cats", "color" vs "colour")
- **Performance optimizations**: Implement more efficient algorithms for very large texts
- **Custom word tokenization**: Allow custom regex patterns for word splitting
- **Diff context**: Provide surrounding context for changes
- **HTML output formatter**: Generate HTML with highlighted changes
- **Character-level fallback**: For detected word changes, show character-level differences

### Ideas for Future Versions
- Support for multiple text formats (Markdown, HTML)
- Integration with popular diff libraries
- Streaming diff for very large documents
- Support for ignoring certain word patterns (e.g., timestamps, IDs)
- Undo/redo change tracking
- Collaborative editing conflict resolution

## [0.1.0] - 2024-09-28

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