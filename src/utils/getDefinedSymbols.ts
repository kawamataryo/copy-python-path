const getDefinedParentSymbols = (symbol: DefinedSymbol, symbols: DefinedSymbol[], result: DefinedSymbol[] = []): DefinedSymbol[] => {
	const parentSymbol = symbols.filter(s => s.column < symbol.column).sort((l, r) => {
		const lDistance = symbol.line - l.line;
		const rDistance = symbol.line - r.line;
		if (lDistance > 0 && lDistance < rDistance) {
			return -1;
		} else {
			return 1;
		}
	})[0];

	if (parentSymbol.column === 0) {
		return [parentSymbol, ...result];
	}

	return getDefinedParentSymbols(parentSymbol, symbols, [parentSymbol, ...result]);
};

export const getDefinedSymbols = (symbols: DefinedSymbol[], lineNumber: number): string[] => {
	const symbol = symbols.filter(s => s.line === lineNumber)[0];
	if (!symbol) {
		return [];
	}
	if (symbol.column === 0) {
		return [symbol.name];
	}
	const parentSymbolNames = getDefinedParentSymbols(symbol, symbols).map(s => s.name);
	return [...parentSymbolNames, symbol.name];
};