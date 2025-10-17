import { compareTexts, visualizeDiff, formatDiffAsHtml, DiffResult, Change } from "../src/index";

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

describe("formatDiffAsHtml", () => {
  // Mock document API before all tests
  beforeAll(() => {
    // Helper to escape HTML like a real browser
    const escapeHtml = (text: string): string => {
      const htmlEscapeMap: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
    };

    // Create a simple DOM implementation for testing
    const mockElement = (tagName: string) => {
      const element: any = {
        tagName: tagName.toLowerCase(),
        className: "",
        style: {},
        textContent: "",
        childNodes: [] as any[],
        appendChild(child: any) {
          this.childNodes.push(child);
        },
        get innerHTML() {
          return this.childNodes
            .map((child: any) => {
              if (child.nodeType === 3) {
                // Text node - escape HTML entities
                return escapeHtml(child.textContent);
              }
              // Element node
              const styles: string[] = [];
              if (child.style.backgroundColor) {
                styles.push(`background-color: ${child.style.backgroundColor}`);
              }
              if (child.style.textDecoration) {
                styles.push(`text-decoration: ${child.style.textDecoration}`);
              }
              const styleAttr = styles.length > 0 ? ` style="${styles.join("; ")}"` : "";
              const classAttr = child.className ? ` class="${child.className}"` : "";
              // Escape text content in element
              const escapedContent = escapeHtml(child.textContent);
              return `<${child.tagName}${classAttr}${styleAttr}>${escapedContent}</${child.tagName}>`;
            })
            .join("");
        },
      };
      return element;
    };

    const mockTextNode = (text: string) => ({
      nodeType: 3,
      textContent: text,
    });

    (global as any).document = {
      createElement: (tagName: string) => mockElement(tagName),
      createTextNode: (text: string) => mockTextNode(text),
    };
  });

  afterAll(() => {
    delete (global as any).document;
  });

  test("should throw error in Node.js environment without document", () => {
    const originalDocument = (global as any).document;
    delete (global as any).document;

    expect(() => {
      formatDiffAsHtml("test", "test");
    }).toThrow("formatDiffAsHtml requires a browser environment");

    (global as any).document = originalDocument;
  });

  test("should generate HTML with default styling", () => {
    const baseText = "The quick brown fox";
    const updatedText = "The fast brown fox";

    const html = formatDiffAsHtml(baseText, updatedText);

    expect(html).toContain('<span class="diff-removed"');
    expect(html).toContain('<span class="diff-added"');
    expect(html).toContain("quick");
    expect(html).toContain("fast");
    expect(html).toContain("background-color");
    expect(html).toContain("line-through");
  });

  test("should apply custom class names", () => {
    const baseText = "hello world";
    const updatedText = "hello universe";

    const html = formatDiffAsHtml(baseText, updatedText, {
      addedStyle: { className: "my-added" },
      removedStyle: { className: "my-removed" },
    });

    expect(html).toContain('class="my-added"');
    expect(html).toContain('class="my-removed"');
    expect(html).not.toContain("diff-added");
    expect(html).not.toContain("diff-removed");
  });

  test("should apply custom highlight colors", () => {
    const baseText = "old text";
    const updatedText = "new text";

    const html = formatDiffAsHtml(baseText, updatedText, {
      addedStyle: { highlightColor: "#00FF00" },
      removedStyle: { highlightColor: "#FF0000" },
    });

    expect(html).toContain("background-color: #00FF00");
    expect(html).toContain("background-color: #FF0000");
  });

  test("should toggle highlighting off", () => {
    const baseText = "old text";
    const updatedText = "new text";

    const html = formatDiffAsHtml(baseText, updatedText, {
      addedStyle: { applyHighlighting: false },
      removedStyle: { applyHighlighting: false },
    });

    expect(html).not.toContain("background-color");
    expect(html).toContain('class="diff-added"');
    expect(html).toContain('class="diff-removed"');
  });

  test("should toggle line-through on added words", () => {
    const baseText = "old text";
    const updatedText = "new text";

    const html = formatDiffAsHtml(baseText, updatedText, {
      addedStyle: { applyLineThrough: true },
    });

    const addedSpans = html.match(/<span class="diff-added"[^>]*>/g) || [];
    expect(addedSpans.some((span) => span.includes("line-through"))).toBe(true);
  });

  test("should toggle line-through off for removed words", () => {
    const baseText = "old text";
    const updatedText = "new text";

    const html = formatDiffAsHtml(baseText, updatedText, {
      removedStyle: { applyLineThrough: false },
    });

    const removedSpans = html.match(/<span class="diff-removed"[^>]*>/g) || [];
    expect(removedSpans.every((span) => !span.includes("line-through"))).toBe(true);
  });

  test("should handle texts with no changes", () => {
    const text = "unchanged text";
    const html = formatDiffAsHtml(text, text);

    expect(html).not.toContain("<span");
    expect(html).toBe("unchanged text");
  });

  test("should escape HTML special characters", () => {
    const baseText = "code <script>alert('xss')</script>";
    const updatedText = "code <div>safe</div>";

    const html = formatDiffAsHtml(baseText, updatedText);

    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;div&gt;");
    expect(html).toContain("&#39;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert('xss')");
  });

  test("should handle ampersands and quotes", () => {
    const baseText = 'test & "quotes"';
    const updatedText = "test & 'quotes'";

    const html = formatDiffAsHtml(baseText, updatedText);

    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;");
    expect(html).toContain("&#39;");
  });

  describe("XSS Security Tests", () => {
    test("should prevent script injection in added words", () => {
      const baseText = "normal text";
      const updatedText = "normal <script>alert('XSS')</script>";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain("alert(&#39;XSS&#39;)");
    });

    test("should prevent script injection in removed words", () => {
      const baseText = "normal <script>alert('XSS')</script>";
      const updatedText = "normal text";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain("alert(&#39;XSS&#39;)");
    });

    test("should prevent img tag injection with onerror", () => {
      const baseText = "test";
      const updatedText = 'test <img src=x onerror="alert(1)">';

      const html = formatDiffAsHtml(baseText, updatedText);

      // The tags are escaped as text content - safe to display
      expect(html).not.toContain("<img");
      expect(html).toContain("&lt;img");
      expect(html).toContain("&quot;");
      // Verify it can't execute by checking the HTML structure
      expect(html).toMatch(/<span[^>]*>&lt;img<\/span>/);
    });

    test("should prevent event handler injection", () => {
      const baseText = "click me";
      const updatedText = 'click <a href="javascript:alert(1)">me</a>';

      const html = formatDiffAsHtml(baseText, updatedText);

      // The malicious link is escaped as text content
      expect(html).not.toContain("<a ");
      expect(html).toContain("&lt;a");
      expect(html).toContain("&quot;");
      // The javascript: protocol is escaped within the text
      expect(html).toMatch(/href=&quot;javascript:alert\(1\)&quot;/);
    });

    test("should prevent iframe injection", () => {
      const baseText = "content";
      const updatedText = "content <iframe src='evil.com'></iframe>";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<iframe");
      expect(html).toContain("&lt;iframe");
      expect(html).toContain("&#39;");
    });

    test("should prevent style tag injection", () => {
      const baseText = "text";
      const updatedText = "text <style>body{display:none}</style>";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<style>");
      expect(html).toContain("&lt;style&gt;");
    });

    test("should prevent data URI XSS", () => {
      const baseText = "link";
      const updatedText = 'link <a href="data:text/html,<script>alert(1)</script>">click</a>';

      const html = formatDiffAsHtml(baseText, updatedText);

      // All HTML is escaped as text content
      expect(html).toContain("&lt;");
      expect(html).toContain("&gt;");
      // The data URI is safe as escaped text
      expect(html).toMatch(/data:text\/html,&lt;script&gt;/);
    });

    test("should prevent SVG-based XSS", () => {
      const baseText = "image";
      const updatedText = 'image <svg onload="alert(1)">';

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<svg");
      expect(html).toContain("&lt;svg");
      // onload is escaped within the text content
      expect(html).toMatch(/onload=&quot;alert\(1\)&quot;/);
    });

    test("should prevent HTML entity double-encoding attacks", () => {
      const baseText = "test";
      const updatedText = "test &lt;script&gt;alert(1)&lt;/script&gt;";

      const html = formatDiffAsHtml(baseText, updatedText);

      // Should escape the ampersands, preventing double-decode attacks
      expect(html).toContain("&amp;lt;");
      expect(html).toContain("&amp;gt;");
      expect(html).not.toContain("<script>");
    });

    test("should prevent CSS injection via custom class names", () => {
      const baseText = "old";
      const updatedText = "new";

      const html = formatDiffAsHtml(baseText, updatedText, {
        addedStyle: { className: '"><script>alert(1)</script><div class="' },
      });

      // The className is sanitized to remove dangerous characters
      expect(html).not.toContain("<script>");
      // The dangerous quote-bracket combo in class attribute is stripped
      expect(html).not.toMatch(/class="[^"]*">/);
      expect(html).not.toMatch(/class="[^"]*<script>/);
      // Verify the sanitized className only contains safe characters
      expect(html).toContain('class="scriptalert1scriptdiv class"');
    });

    test("should prevent injection through unchanged text", () => {
      const baseText = "unchanged <script>alert('XSS')</script> text";
      const updatedText = "unchanged <script>alert('XSS')</script> text";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain("alert(&#39;XSS&#39;)");
    });

    test("should handle null byte injection attempts", () => {
      const baseText = "test";
      const updatedText = "test\x00<script>alert(1)</script>";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    test("should prevent attribute injection in unchanged words", () => {
      const baseText = 'normal " onclick="alert(1)" text';
      const updatedText = 'normal " onclick="alert(1)" text';

      const html = formatDiffAsHtml(baseText, updatedText);

      // Quotes should be escaped
      expect(html).toContain("&quot;");
      expect(html).not.toContain('onclick="alert(1)"');
    });
  });

  test("should respect ignoreCase option", () => {
    const baseText = "Hello World";
    const updatedText = "hello world";

    const html = formatDiffAsHtml(baseText, updatedText, { ignoreCase: true });

    expect(html).not.toContain('<span class="diff-added"');
    expect(html).not.toContain('<span class="diff-removed"');
    expect(html).toBe("Hello World");
  });

  test("should handle empty strings", () => {
    expect(formatDiffAsHtml("", "")).toBe("");
    expect(formatDiffAsHtml("hello", "")).toContain("diff-removed");
    expect(formatDiffAsHtml("", "hello")).toContain("diff-added");
  });

  test("should handle whitespace properly", () => {
    const baseText = "  hello   world  ";
    const updatedText = "hello world";

    const html = formatDiffAsHtml(baseText, updatedText);

    expect(html).toBe("hello world");
  });

  test("should combine multiple style options", () => {
    const baseText = "old text";
    const updatedText = "new text";

    const html = formatDiffAsHtml(baseText, updatedText, {
      addedStyle: {
        className: "custom-add",
        applyHighlighting: true,
        highlightColor: "#FFFF00",
        applyLineThrough: false,
      },
      removedStyle: {
        className: "custom-remove",
        applyHighlighting: false,
        applyLineThrough: false,
      },
    });

    expect(html).toContain('class="custom-add"');
    expect(html).toContain("background-color: #FFFF00");
    expect(html).toContain('class="custom-remove"');

    const removedSpans = html.match(/<span class="custom-remove"[^>]*>/g) || [];
    expect(removedSpans.every((span) => !span.includes("background-color"))).toBe(true);
    expect(removedSpans.every((span) => !span.includes("line-through"))).toBe(true);
  });

  test("should maintain word order and spacing", () => {
    const baseText = "The quick brown fox jumps";
    const updatedText = "The fast brown fox leaps";

    const html = formatDiffAsHtml(baseText, updatedText);

    // The HTML should show both removed and added words in diff order
    // This means showing replacements inline: removed word followed by added word
    const textOnly = html.replace(/<[^>]*>/g, "");
    const words = textOnly.split(/\s+/).filter((w) => w.length > 0);

    // The diff shows: The [removed:quick] [added:fast] brown fox [removed:jumps] [added:leaps]
    expect(words).toEqual(["The", "fast", "quick", "brown", "fox", "leaps", "jumps"]);
  });

  test("should handle special characters in text", () => {
    const baseText = "hello @world #test";
    const updatedText = "hello @universe #test";

    const html = formatDiffAsHtml(baseText, updatedText);

    expect(html).toContain("@world");
    expect(html).toContain("@universe");
    expect(html).toContain("#test");
  });

  describe("showRemoved and showAdded filtering", () => {
    test("should show only removed words when showAdded is false", () => {
      const baseText = "The quick brown fox";
      const updatedText = "The fast brown fox";

      const html = formatDiffAsHtml(baseText, updatedText, { showAdded: false });

      expect(html).toContain('<span class="diff-removed"');
      expect(html).toContain("quick");
      expect(html).not.toContain('<span class="diff-added"');
      expect(html).toContain("fast"); // Word still present, just not highlighted
    });

    test("should show only added words when showRemoved is false", () => {
      const baseText = "The quick brown fox";
      const updatedText = "The fast brown fox";

      const html = formatDiffAsHtml(baseText, updatedText, { showRemoved: false });

      expect(html).toContain('<span class="diff-added"');
      expect(html).toContain("fast");
      expect(html).not.toContain('<span class="diff-removed"');
      expect(html).toContain("quick"); // Word still present, just not highlighted
    });

    test("should show no highlighting when both showRemoved and showAdded are false", () => {
      const baseText = "The quick brown fox";
      const updatedText = "The fast brown fox";

      const html = formatDiffAsHtml(baseText, updatedText, {
        showRemoved: false,
        showAdded: false,
      });

      expect(html).not.toContain("<span");
      expect(html).toContain("quick");
      expect(html).toContain("fast");
      expect(html).toContain("brown");
    });

    test("should show both by default (backward compatibility)", () => {
      const baseText = "The quick brown fox";
      const updatedText = "The fast brown fox";

      const html = formatDiffAsHtml(baseText, updatedText);

      expect(html).toContain('<span class="diff-removed"');
      expect(html).toContain('<span class="diff-added"');
    });

    test("should work with only additions in text", () => {
      const baseText = "hello world";
      const updatedText = "hello beautiful world";

      const htmlShowAll = formatDiffAsHtml(baseText, updatedText);
      expect(htmlShowAll).toContain('<span class="diff-added"');

      const htmlHideAdded = formatDiffAsHtml(baseText, updatedText, { showAdded: false });
      expect(htmlHideAdded).not.toContain("<span");
      expect(htmlHideAdded).toContain("beautiful");
    });

    test("should work with only removals in text", () => {
      const baseText = "hello beautiful world";
      const updatedText = "hello world";

      const htmlShowAll = formatDiffAsHtml(baseText, updatedText);
      expect(htmlShowAll).toContain('<span class="diff-removed"');

      const htmlHideRemoved = formatDiffAsHtml(baseText, updatedText, { showRemoved: false });
      expect(htmlHideRemoved).not.toContain("<span");
      expect(htmlHideRemoved).toContain("beautiful");
    });

    test("should combine with custom styling options", () => {
      const baseText = "old text";
      const updatedText = "new text";

      const html = formatDiffAsHtml(baseText, updatedText, {
        showRemoved: false,
        addedStyle: {
          className: "custom-add",
          highlightColor: "#00FF00",
        },
      });

      expect(html).toContain('class="custom-add"');
      expect(html).toContain("background-color: #00FF00");
      expect(html).not.toContain("diff-removed");
      expect(html).toContain("old"); // Present but not styled
    });

    test("should work with ignoreCase option", () => {
      const baseText = "Hello WORLD test";
      const updatedText = "hello world TEST";

      const html = formatDiffAsHtml(baseText, updatedText, {
        ignoreCase: true,
        showRemoved: false,
      });

      expect(html).not.toContain("<span");
    });
  });
});
