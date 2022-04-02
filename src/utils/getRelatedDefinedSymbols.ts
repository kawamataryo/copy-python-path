import { Python3Parser, Python3Listener } from 'dt-python-parser';

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

/**
 * Get defined symbols related to the selected rows from a python file. e.g. Class name, function name
 * @param  {string} text - python code
 * @param  {number} lineNumber - current cursor line number
 * @return {array} defined symbols
 */
export const getRelatedDefinedSymbols = (text: string, lineNumber: number): string[] => {
	const parser = new Python3Parser();
	const tree = parser.parse(text);

	const symbols: DefinedSymbol[] = [];
	class MyListener extends Python3Listener {
		enterClassdef(ctx: any): void {
			symbols.push({
				name: ctx.children[1].getText(),
				line: ctx.children[0].getSymbol().line,
				column: ctx.children[0].getSymbol().column,
			});
		}
		enterFuncdef(ctx: any): void {
			symbols.push({
				name: ctx.children[1].getText(),
				line: ctx.children[0].getSymbol().line,
				column: ctx.children[0].getSymbol().column,
			});
		}
	}
	const listenTableName = new MyListener();
	parser.listen(listenTableName, tree);

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