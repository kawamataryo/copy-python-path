import * as vscode from 'vscode';
import { Python3Parser, Python3Listener } from 'dt-python-parser';
import { getDefinedSymbols } from './utils/getDefinedSymbols';


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('copy-python-path.copy-python-path', async () => {
		const filename = vscode.window.activeTextEditor?.document.fileName;
		if (!filename) { return; }

		if (/.py$/.test(filename)) {
			// get current file dotted path
			const rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath!;
			const filePath = filename.replace(rootPath, '').replaceAll('/', '.').replace('.py', '').slice(1);

			// parsed current file's code
			const text = vscode.window.activeTextEditor!.document.getText();
			const parser = new Python3Parser();
			const tree = parser.parse(text);
			const symbols: DefinedSymbol[] = [];
			try {
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

				// get current defined symbols dotted path
				const currentLine = vscode.window.activeTextEditor!.selection.active.line;
				const definedSymbols = getDefinedSymbols(symbols, currentLine + 1);

				// copy python dotted path to clipboard
				await vscode.env.clipboard.writeText([filePath, ...definedSymbols].join('.'));
				vscode.window.showInformationMessage('Copied to clipboard');
			} catch (e) {
				console.error(e);
				vscode.window.showErrorMessage('Failed to parse file');
			}
		} else {
			vscode.window.showErrorMessage('Not a python file');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
