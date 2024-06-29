
const symbolRegex = /^(\s*)(?:class|def)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;

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
    const lines = sourceCode.split('\n');
    const definedSymbols: string[] = [];
    let currentIndentLevel = -1;

    for (let i = currentLine; i >= 0; i--) {
        const match = lines[i].match(symbolRegex);
        if (match) {
            const [, indent, symbol] = match;
            const indentLevel = indent.length;

            if (i === currentLine) {
                definedSymbols.push(symbol);
                currentIndentLevel = indentLevel;
            } else if (indentLevel < currentIndentLevel) {
                definedSymbols.unshift(symbol);
                currentIndentLevel = indentLevel;
            }
        }
    }

    return definedSymbols;
};
