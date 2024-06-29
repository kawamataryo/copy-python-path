import * as vscode from 'vscode';
import { getRelatedDefinedSymbols } from './utils/getRelatedDefinedSymbols';
import { getCurrentFileDottedPath } from './utils/getCurrentFileDottedPath';


export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('copy-python-path.copy-python-path', async () => {

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor! Only use this command when selected file in active editor.");
      return;
    }

    const resource = editor.document.uri;
    if (resource.scheme === 'file') {
      const currentFilePath = editor.document.fileName;
      if (!currentFilePath) {
        vscode.window.showErrorMessage("Don't read file. only use this command when selected file.");
        return;
      }
      if (!/.py$/.test(currentFilePath)) {
        vscode.window.showErrorMessage('Not a python file. only use this command when selected python file.');
        return;
      }
      // Get workspace folder to determine relative path
      const folder = vscode.workspace.getWorkspaceFolder(resource);
      if (!folder) {
        vscode.window.showErrorMessage('No workspace folder is opened. only use this command in a workspace.');
        return;
      }

      const config = vscode.workspace.getConfiguration("copyPythonPath");
      const shouldAddModuleRootName = config.get<boolean>("addModuleRootName");

      // get current file dotted path
      const currentFileDottedPath = getCurrentFileDottedPath({ rootPath: folder.uri.fsPath, currentFilePath: currentFilePath, shouldAddModuleRootName});

      try {
        // get related defined symbols from current file and current cursor position
        const text = vscode.window.activeTextEditor!.document.getText();
        const currentLine = vscode.window.activeTextEditor!.selection.active.line;
        const definedSymbols = getRelatedDefinedSymbols(text, currentLine);
        const finalOutPath = [currentFileDottedPath, ...definedSymbols].join('.');
        // copy python dotted path to clipboard
        await vscode.env.clipboard.writeText(finalOutPath);
        // vscode.window.showInformationMessage('Copied to clipboard.');
        vscode.window.showInformationMessage(['📋 Copied to clipboard', finalOutPath].join(': '));
      } catch (e) {
        console.error(e);
        vscode.window.showErrorMessage('Failed to parse file.');
      }
    }

  });
  context.subscriptions.push(disposable);

  const disposable2 = vscode.commands.registerCommand('copy-python-path.copy-python-import-statement', async () => {

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor! Only use this command when selected file in active editor.");
      return;
    }

    const resource = editor.document.uri;
    if (resource.scheme === 'file') {
      const currentFilePath = editor.document.fileName;
      if (!currentFilePath) {
        vscode.window.showErrorMessage("Don't read file. only use this command when selected file.");
        return;
      }
      if (!/.py$/.test(currentFilePath)) {
        vscode.window.showErrorMessage('Not a python file. only use this command when selected python file.');
        return;
      }
      // Get workspace folder to determine relative path
      const folder = vscode.workspace.getWorkspaceFolder(resource);
      if (!folder) {
        vscode.window.showErrorMessage('No workspace folder is opened. only use this command in a workspace.');
        return;
        // text = `$(alert) <outside workspace> → ${basename(resource.fsPath)}`;
      }

      const config = vscode.workspace.getConfiguration("copyPythonPath");
      const shouldAddModuleRootName = config.get<boolean>("addModuleRootName");

      // get current file dotted path
      const currentFileDottedPath = getCurrentFileDottedPath({ rootPath: folder.uri.fsPath, currentFilePath: currentFilePath, shouldAddModuleRootName});

      try {
        // get related defined symbols from current file and current cursor position
        const text = vscode.window.activeTextEditor!.document.getText();
        const currentLine = vscode.window.activeTextEditor!.selection.active.line;
        const definedSymbols = getRelatedDefinedSymbols(text, currentLine);
        const finalOutPath = currentFileDottedPath;
        const finalImportStatement = `from ${finalOutPath} import ${definedSymbols.join(', ')}`;

        // copy python dotted path to clipboard
        await vscode.env.clipboard.writeText(finalImportStatement);
        // vscode.window.showInformationMessage('Copied to clipboard.');
        vscode.window.showInformationMessage(['📋 Copied to clipboard', finalImportStatement].join(': '));
      } catch (e) {
        console.error(e);
        vscode.window.showErrorMessage('Failed to parse file.');
      }
    }

  });
  context.subscriptions.push(disposable2);


}

export function deactivate() { }
