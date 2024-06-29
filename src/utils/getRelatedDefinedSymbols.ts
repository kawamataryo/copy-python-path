/**
 * Extracts the symbol (class or function name) and its indentation level from a given line of code.
 * @param text - The given line of code to search for class or function keyword with its name.
 * @returns An object containing the symbol and its indentation level or null if not found.
 */
const extractSymbolAndIndent = (
	text: string,
): { symbol: string; indentLevel: number } | null => {
	const regex = /(?:class|def)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
	const match = text.match(regex);
	if (!match) {
		return null;
	}
	return {
		symbol: match[1],
		indentLevel: text.search(/\S|$/), // Search for the first non-whitespace character
	};
};

/**
 * Retrieves symbols that are defined before the current line in the source code and have lower indentation level.
 * @param sourceCode - The entire source code as a string.
 * @param currentLine - The line index (0-based) currently being analyzed.
 * @returns An array of symbols defined before the current line in hierarchical order.
 */
export const getRelatedDefinedSymbols = (
	sourceCode: string,
	currentLine: number,
): string[] => {
	const lines = sourceCode.split("\n");
	const currentLineText = lines[currentLine];

	// Extract the current symbol and its indent level
	const currentSymbolInfo = extractSymbolAndIndent(currentLineText);
	if (!currentSymbolInfo) {
		return [];
	}

	let currentIndentLevel = currentSymbolInfo.indentLevel;
	const definedSymbols: string[] = [];

	// Analyze lines before the current line to gather symbols with lower indentation
	for (let i = currentLine - 1; i >= 0; i--) {
		const symbolInfo = extractSymbolAndIndent(lines[i]);
		if (symbolInfo && symbolInfo.indentLevel < currentIndentLevel) {
			definedSymbols.unshift(symbolInfo.symbol); // Prepend to maintain correct order
			currentIndentLevel = symbolInfo.indentLevel;
		}
	}

	// Include the current symbol at the end of the list
	definedSymbols.push(currentSymbolInfo.symbol);

	return definedSymbols;
};
