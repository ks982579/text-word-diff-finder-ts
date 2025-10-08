export interface DiffResult {
  removedPositions: number[];
  addedPositions: number[];
}

export interface Change {
  type: "added" | "removed" | "unchanged";
  word: string;
  baseIndex?: number;
  updatedIndex?: number;
}

export interface CompareOptions {
  ignoreCase?: boolean;
}

export interface WordStyleOptions {
  applyHighlighting?: boolean;
  highlightColor?: string;
  className?: string;
  applyLineThrough?: boolean;
}

export interface HtmlFormatOptions {
  ignoreCase?: boolean;
  addedStyle?: WordStyleOptions;
  removedStyle?: WordStyleOptions;
}

/**
 * Compares two text strings and returns the positions of added and removed words
 * @param baseText - The original text
 * @param updatedText - The modified text
 * @param options - Optional configuration for comparison behavior
 * @returns Object containing arrays of word positions for removed and added content
 */
export function compareTexts(
  baseText: string,
  updatedText: string,
  options?: CompareOptions,
): DiffResult {
  const baseWords = baseText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const updatedWords = updatedText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const changes = computeLCS(baseWords, updatedWords, options);

  const removedPositions: number[] = [];
  const addedPositions: number[] = [];

  changes.forEach((change) => {
    if (change.type === "removed" && change.baseIndex !== undefined) {
      removedPositions.push(change.baseIndex);
    } else if (change.type === "added" && change.updatedIndex !== undefined) {
      addedPositions.push(change.updatedIndex);
    }
  });

  return {
    removedPositions,
    addedPositions,
  };
}

/**
 * Computes the Longest Common Subsequence (LCS) to find differences
 * This is the core algorithm used by most diff tools
 */
function computeLCS(baseWords: string[], updatedWords: string[], options?: CompareOptions): Change[] {
  const m = baseWords.length;
  const n = updatedWords.length;
  const ignoreCase = options?.ignoreCase ?? false;

  // Helper function to compare words based on options
  const wordsEqual = (word1: string, word2: string): boolean => {
    if (ignoreCase) {
      return word1.toLowerCase() === word2.toLowerCase();
    }
    return word1 === word2;
  };

  // Create LCS table
  const lcs: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Fill LCS table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordsEqual(baseWords[i - 1], updatedWords[j - 1])) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  // Backtrack to find the actual changes
  const changes: Change[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsEqual(baseWords[i - 1], updatedWords[j - 1])) {
      // Words are the same
      changes.unshift({
        type: "unchanged",
        word: baseWords[i - 1],
        baseIndex: i - 1,
        updatedIndex: j - 1,
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || lcs[i - 1][j] >= lcs[i][j - 1])) {
      // Word was removed from base
      changes.unshift({
        type: "removed",
        word: baseWords[i - 1],
        baseIndex: i - 1,
      });
      i--;
    } else {
      // Word was added in updated
      changes.unshift({
        type: "added",
        word: updatedWords[j - 1],
        updatedIndex: j - 1,
      });
      j--;
    }
  }

  return changes;
}

/**
 * Helper function to visualize the diff (useful for debugging)
 * @param baseText - The original text
 * @param updatedText - The modified text
 * @param options - Optional configuration for comparison behavior
 * @returns A string representation of the changes
 */
export function visualizeDiff(baseText: string, updatedText: string, options?: CompareOptions): string {
  const result = compareTexts(baseText, updatedText, options);
  const baseWords = baseText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const updatedWords = updatedText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  let visualization = "";

  // Show base text with removals highlighted
  visualization += "Base text (- = removed):\n";
  baseWords.forEach((word, index) => {
    if (result.removedPositions.includes(index)) {
      visualization += `[-${word}] `;
    } else {
      visualization += `${word} `;
    }
  });

  visualization += "\n\nUpdated text (+ = added):\n";
  updatedWords.forEach((word, index) => {
    if (result.addedPositions.includes(index)) {
      visualization += `[+${word}] `;
    } else {
      visualization += `${word} `;
    }
  });

  return visualization;
}

/**
 * Formats the diff between two texts as HTML with styling options
 * @param baseText - The original text
 * @param updatedText - The modified text
 * @param options - Optional configuration for HTML formatting and comparison behavior
 * @returns HTML string with styled diff markup
 * @throws Error if called in a non-browser environment (requires document API)
 */
export function formatDiffAsHtml(
  baseText: string,
  updatedText: string,
  options?: HtmlFormatOptions,
): string {
  // Check for browser environment
  if (typeof document === "undefined") {
    throw new Error(
      "formatDiffAsHtml requires a browser environment with document API. This function is not available in Node.js.",
    );
  }

  const baseWords = baseText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const updatedWords = updatedText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const compareOptions: CompareOptions = {
    ignoreCase: options?.ignoreCase,
  };

  const changes = computeLCS(baseWords, updatedWords, compareOptions);

  // Default style options
  const defaultAddedStyle: WordStyleOptions = {
    applyHighlighting: true,
    highlightColor: "#90EE90",
    className: "diff-added",
    applyLineThrough: false,
  };

  const defaultRemovedStyle: WordStyleOptions = {
    applyHighlighting: true,
    highlightColor: "#FFB6C1",
    className: "diff-removed",
    applyLineThrough: true,
  };

  const addedStyle = { ...defaultAddedStyle, ...options?.addedStyle };
  const removedStyle = { ...defaultRemovedStyle, ...options?.removedStyle };

  // Helper function to sanitize className to prevent attribute injection
  const sanitizeClassName = (className: string): string => {
    // Remove any characters that could break out of the class attribute
    // Only allow alphanumeric, hyphens, underscores, and spaces
    return className.replace(/[^a-zA-Z0-9\-_ ]/g, "");
  };

  // Helper function to create a styled span element
  const createStyledSpan = (word: string, changeType: "added" | "removed"): HTMLSpanElement => {
    const styleOpts = changeType === "added" ? addedStyle : removedStyle;
    const span = document.createElement("span");

    // Set class name (sanitize to prevent attribute injection)
    if (styleOpts.className) {
      span.className = sanitizeClassName(styleOpts.className);
    }

    // Apply inline styles
    if (styleOpts.applyHighlighting && styleOpts.highlightColor) {
      span.style.backgroundColor = styleOpts.highlightColor;
    }

    if (styleOpts.applyLineThrough) {
      span.style.textDecoration = "line-through";
    }

    // Set text content (automatically escapes)
    span.textContent = word;

    return span;
  };

  // Build HTML output using a container
  const container = document.createElement("div");

  changes.forEach((change, index) => {
    if (index > 0) {
      container.appendChild(document.createTextNode(" "));
    }

    if (change.type === "removed") {
      container.appendChild(createStyledSpan(change.word, "removed"));
    } else if (change.type === "added") {
      container.appendChild(createStyledSpan(change.word, "added"));
    } else {
      container.appendChild(document.createTextNode(change.word));
    }
  });

  return container.innerHTML;
}

export { compareTexts as default };
