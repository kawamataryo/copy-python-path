import * as vscode from 'vscode';
import { getDefinedSymbols } from './utils/getDefinedSymbols';


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('copy-python-path.copy-python-path', async () => {
		const filename = vscode.window.activeTextEditor?.document.fileName;

		if (!filename) {
			vscode.window.showErrorMessage("Don't read file. only use this command when selected file.");
			return;
		}

		if (!/.py$/.test(filename)) {
			vscode.window.showErrorMessage('Not a python file. only use this command when selected python file.');
			return;
		}

		const folders = vscode.workspace.workspaceFolders;
		if(!folders) {
			vscode.window.showErrorMessage('No workspace folder is opened. only use this command in a workspace.');
			return;
		}

		// get current file dotted path
		const rootPath = folders[0].uri.fsPath!;
		const filePath = filename.replace(rootPath, '').replaceAll('/', '.').replace(/\.py$/, '').slice(1);

		try {
			// get current defined symbols dotted path
			const text = vscode.window.activeTextEditor!.document.getText();
			const currentLine = vscode.window.activeTextEditor!.selection.active.line;
			const definedSymbols = getDefinedSymbols(text, currentLine + 1);

			// copy python dotted path to clipboard
			await vscode.env.clipboard.writeText([filePath, ...definedSymbols].join('.'));
			vscode.window.showInformationMessage('Copied to clipboard.');
		} catch (e) {
			console.error(e);
			vscode.window.showErrorMessage('Failed to parse file.');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
