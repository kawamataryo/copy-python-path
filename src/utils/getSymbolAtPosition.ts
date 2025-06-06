/**
 * Find the symbol at the current cursor position.
 * @param text - The text of the current line.
 * @param column - The column position (0-based) of the cursor.
 * @returns The symbol at the current position, or undefined if not found.
 */
export const getSymbolAtPosition = (text: string, column: number): string | undefined => {
  // If cursor is outside the text boundary, return undefined
  if (column < 0 || column >= text.length) {
    return undefined;
  }

  // Regex for valid Python identifier characters
  const identifierChar = /[a-zA-Z0-9_]/;

  // First check if the cursor is directly on an identifier character
  if (!identifierChar.test(text[column])) {
    return undefined;
  }

  // Find the start of the symbol (going left from cursor)
  let start = column;
  while (start > 0 && identifierChar.test(text[start - 1])) {
    start--;
  }

  // Find the end of the symbol (going right from cursor)
  let end = column;
  while (end < text.length && identifierChar.test(text[end])) {
    end++;
  }

  // Extract the symbol
  const symbol = text.substring(start, end);

  // If the symbol is empty or not a valid identifier, return undefined
  if (!symbol || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(symbol)) {
    return undefined;
  }

  return symbol;
};
