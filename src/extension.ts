import * as vscode from 'vscode';
import { getRelatedDefinedSymbols } from './utils/getRelatedDefinedSymbols';
import { getCurrentFileDottedPath } from './utils/getCurrentFileDottedPath';


export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('copy-python-path.copy-python-path', async () => {
    const currentFilePath = vscode.window.activeTextEditor?.document.fileName;

    if (!currentFilePath) {
      vscode.window.showErrorMessage("Don't read file. only use this command when selected file.");
      return;
    }

    if (!/.py$/.test(currentFilePath)) {
      vscode.window.showErrorMessage('Not a python file. only use this command when selected python file.');
      return;
    }

    const folders = vscode.workspace.workspaceFolders;
    if(!folders) {
      vscode.window.showErrorMessage('No workspace folder is opened. only use this command in a workspace.');
      return;
    }

    // get current file dotted path
    const currentFileDottedPath = getCurrentFileDottedPath(folders[0].uri.fsPath, currentFilePath);

    try {
      // get related defined symbols from current file and current cursor position
      const text = vscode.window.activeTextEditor!.document.getText();
      const currentLine = vscode.window.activeTextEditor!.selection.active.line;
      const definedSymbols = getRelatedDefinedSymbols(text, currentLine + 1);

      // copy python dotted path to clipboard
      await vscode.env.clipboard.writeText([currentFileDottedPath, ...definedSymbols].join('.'));
      vscode.window.showInformationMessage('Copied to clipboard.');
    } catch (e) {
      console.error(e);
      vscode.window.showErrorMessage('Failed to parse file.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }
