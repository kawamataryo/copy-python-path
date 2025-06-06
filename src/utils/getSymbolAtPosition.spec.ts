import { describe, expect, it } from "vitest";
import { getSymbolAtPosition } from "./getSymbolAtPosition";

describe("getSymbolAtPosition", () => {
  it("should find a symbol at the cursor position", () => {
    const line = "data = CreateCourseQuizRequest(**json.loads(request.body))";

    // Cursor at the beginning of a symbol
    expect(getSymbolAtPosition(line, 7)).toBe("CreateCourseQuizRequest");

    // Cursor in the middle of a symbol
    expect(getSymbolAtPosition(line, 15)).toBe("CreateCourseQuizRequest");

    // Cursor at the end of a symbol
    expect(getSymbolAtPosition(line, 28)).toBe("CreateCourseQuizRequest");
  });

  it("should return undefined when cursor is not on a symbol", () => {
    const line = "data = CreateCourseQuizRequest(**json.loads(request.body))";

    // Cursor on whitespace
    expect(getSymbolAtPosition(line, 6)).toBeUndefined();

    // Cursor on a special character (parenthesis)
    expect(getSymbolAtPosition(line, 30)).toBeUndefined();
  });

  it("should handle edge cases", () => {
    // Empty line
    expect(getSymbolAtPosition("", 0)).toBeUndefined();

    // Out of bounds position
    expect(getSymbolAtPosition("symbol", 10)).toBeUndefined();
    expect(getSymbolAtPosition("symbol", -1)).toBeUndefined();

    // Single character symbol
    expect(getSymbolAtPosition("x = 1", 0)).toBe("x");
  });
});
