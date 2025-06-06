/**
 * Creates a map of imported symbols to their full dotted paths.
 * @param sourceCode - The entire source code as a string.
 * @returns A map of local symbols to their fully qualified dotted paths.
 */
export const getImportedSymbolMap = (sourceCode: string): Map<string, string> => {
  const lines = sourceCode.split("\n");
  const symbolMap = new Map<string, string>();

  // Two main types of import statements:
  // 1. from module.path import Symbol, AnotherSymbol
  // 2. import module.path.Symbol as alias

  // Regex for "from X import Y" pattern
  const fromImportRegex = /^\s*from\s+([\w.]+)\s+import\s+(.+)$/;

  // Regex for "import X" pattern
  const importRegex = /^\s*import\s+(.+)$/;

  for (const line of lines) {
    // Handle "from X import Y" pattern
    const fromMatch = line.match(fromImportRegex);
    if (fromMatch) {
      const modulePath = fromMatch[1];
      // Parse imported symbols (handling potential commas and 'as' aliases)
      const importedSymbolsPart = fromMatch[2];
      const importedSymbols = importedSymbolsPart.split(",").map((s) => s.trim());

      for (const symbolPart of importedSymbols) {
        if (!symbolPart) continue;

        // Handle potential "as" alias
        const asMatch = symbolPart.match(/^([\w]+)(?:\s+as\s+([\w]+))?$/);
        if (asMatch) {
          const originalSymbol = asMatch[1];
          const aliasSymbol = asMatch[2] || originalSymbol; // Use the original name if no alias
          symbolMap.set(aliasSymbol, `${modulePath}.${originalSymbol}`);
        }
      }
      continue;
    }

    // Handle "import X" pattern
    const importMatch = line.match(importRegex);
    if (importMatch) {
      const importedPart = importMatch[1];
      const imports = importedPart.split(",").map((s) => s.trim());

      for (const importPart of imports) {
        if (!importPart) continue;

        // Handle "import module.path.Symbol as alias"
        const asMatch = importPart.match(/^([\w.]+)(?:\s+as\s+([\w]+))?$/);
        if (asMatch) {
          const fullPath = asMatch[1];
          const alias = asMatch[2];

          if (alias) {
            // If there's an alias, map it to the full path
            symbolMap.set(alias, fullPath);
          } else {
            // If no alias, extract the last part of the path as symbol
            const parts = fullPath.split(".");
            const lastPart = parts[parts.length - 1];
            symbolMap.set(lastPart, fullPath);
          }
        }
      }
    }
  }

  return symbolMap;
};
