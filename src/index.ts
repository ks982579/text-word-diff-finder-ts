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

/**
 * Compares two text strings and returns the positions of added and removed words
 * @param baseText - The original text
 * @param updatedText - The modified text
 * @returns Object containing arrays of word positions for removed and added content
 */
export function compareTexts(
  baseText: string,
  updatedText: string,
): DiffResult {
  const baseWords = baseText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const updatedWords = updatedText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const changes = computeLCS(baseWords, updatedWords);

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
function computeLCS(baseWords: string[], updatedWords: string[]): Change[] {
  const m = baseWords.length;
  const n = updatedWords.length;

  // Create LCS table
  const lcs: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Fill LCS table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (baseWords[i - 1] === updatedWords[j - 1]) {
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
    if (i > 0 && j > 0 && baseWords[i - 1] === updatedWords[j - 1]) {
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
 * @returns A string representation of the changes
 */
export function visualizeDiff(baseText: string, updatedText: string): string {
  const result = compareTexts(baseText, updatedText);
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

export { compareTexts as default };
