import * as vscode from "vscode";
import { getRelatedDefinedSymbols } from "./utils/getRelatedDefinedSymbols";
import { getCurrentFileDottedPath } from "./utils/getCurrentFileDottedPath";
import { getImportedSymbolMap } from "./utils/getImportedSymbolMap";
import { getSymbolAtPosition } from "./utils/getSymbolAtPosition";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("copy-python-path.copy-python-path", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor! Only use this command when selected file in active editor.");
      return;
    }

    const resource = editor.document.uri;
    if (resource.scheme === "file") {
      const currentFilePath = editor.document.fileName;
      if (!currentFilePath) {
        vscode.window.showErrorMessage("Don't read file. only use this command when selected file.");
        return;
      }
      if (!/.py$/.test(currentFilePath)) {
        vscode.window.showErrorMessage("Not a python file. only use this command when selected python file.");
        return;
      }
      // Get workspace folder to determine relative path
      const folder = vscode.workspace.getWorkspaceFolder(resource);
      if (!folder) {
        vscode.window.showErrorMessage("No workspace folder is opened. only use this command in a workspace.");
        return;
      }

      const config = vscode.workspace.getConfiguration("copyPythonPath");
      const shouldAddModuleRootName = config.get<boolean>("addModuleRootName");
      const omitRootPath = config.get<string>("omitRootPath");

      // get current file dotted path
      const currentFileDottedPath = getCurrentFileDottedPath({
        rootPath: folder.uri.fsPath,
        currentFilePath: currentFilePath,
        shouldAddModuleRootName,
        omitRootPath,
      });

      try {
        // Get the full text of the document
        const text = editor.document.getText();

        // Get the current cursor position
        const position = editor.selection.active;
        const currentLine = position.line;
        const currentChar = position.character;

        // Get the text of the current line
        const lineText = editor.document.lineAt(currentLine).text;

        // Try to find a symbol at the current cursor position
        const symbolAtCursor = getSymbolAtPosition(lineText, currentChar);

        if (symbolAtCursor) {
          // Check if the symbol is an imported symbol
          const importedSymbolMap = getImportedSymbolMap(text);
          const importedPath = importedSymbolMap.get(symbolAtCursor);

          if (importedPath) {
            // Found an imported symbol, copy its full path
            await vscode.env.clipboard.writeText(importedPath);
            vscode.window.showInformationMessage(`Copied imported symbol: ${importedPath}`);
            return;
          }
        }

        // Fall back to the original behavior if we didn't find an imported symbol
        const definedSymbols = getRelatedDefinedSymbols(text, currentLine);
        const finalOutPath = [currentFileDottedPath, ...definedSymbols].join(".");

        // copy python dotted path to clipboard
        await vscode.env.clipboard.writeText(finalOutPath);
        vscode.window.showInformationMessage(["Copied to clipboard", finalOutPath].join(": "));
      } catch (e) {
        console.error(e);
        vscode.window.showErrorMessage("Failed to parse file.");
      }
    }
  });
  context.subscriptions.push(disposable);

  const disposable2 = vscode.commands.registerCommand("copy-python-path.copy-python-import-statement", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor! Only use this command when selected file in active editor.");
      return;
    }

    const resource = editor.document.uri;
    if (resource.scheme === "file") {
      const currentFilePath = editor.document.fileName;
      if (!currentFilePath) {
        vscode.window.showErrorMessage("Don't read file. only use this command when selected file.");
        return;
      }
      if (!/.py$/.test(currentFilePath)) {
        vscode.window.showErrorMessage("Not a python file. only use this command when selected python file.");
        return;
      }
      // Get workspace folder to determine relative path
      const folder = vscode.workspace.getWorkspaceFolder(resource);
      if (!folder) {
        vscode.window.showErrorMessage("No workspace folder is opened. only use this command in a workspace.");
        return;
      }

      const config = vscode.workspace.getConfiguration("copyPythonPath");
      const shouldAddModuleRootName = config.get<boolean>("addModuleRootName");
      const omitRootPath = config.get<string>("omitRootPath");

      // get current file dotted path
      const currentFileDottedPath = getCurrentFileDottedPath({
        rootPath: folder.uri.fsPath,
        currentFilePath: currentFilePath,
        shouldAddModuleRootName,
        omitRootPath,
      });

      try {
        // Get the full text of the document
        const text = editor.document.getText();

        // Get the current cursor position
        const position = editor.selection.active;
        const currentLine = position.line;
        const currentChar = position.character;

        // Get the text of the current line
        const lineText = editor.document.lineAt(currentLine).text;

        // Try to find a symbol at the current cursor position
        const symbolAtCursor = getSymbolAtPosition(lineText, currentChar);

        if (symbolAtCursor) {
          // Check if the symbol is an imported symbol
          const importedSymbolMap = getImportedSymbolMap(text);

          const importedPath = importedSymbolMap.get(symbolAtCursor);

          if (importedPath) {
            // Generate import statement for the imported symbol
            const lastDotIndex = importedPath.lastIndexOf(".");
            if (lastDotIndex !== -1) {
              const modulePath = importedPath.substring(0, lastDotIndex);
              const symbolName = importedPath.substring(lastDotIndex + 1);
              const importStatement = `from ${modulePath} import ${symbolName}`;
              await vscode.env.clipboard.writeText(importStatement);
              vscode.window.showInformationMessage(`Copied import statement: ${importStatement}`);
              return;
            } else {
              // Simple module with no dots
              const importStatement = `import ${importedPath}`;
              await vscode.env.clipboard.writeText(importStatement);
              vscode.window.showInformationMessage(`Copied import statement: ${importStatement}`);
              return;
            }
          }
        }

        // Fall back to the original behavior
        const definedSymbols = getRelatedDefinedSymbols(text, currentLine);
        const finalImportStatement = `from ${currentFileDottedPath} import ${definedSymbols.join(", ")}`;

        // copy python dotted path to clipboard
        await vscode.env.clipboard.writeText(finalImportStatement);
        vscode.window.showInformationMessage(["Copied to clipboard", finalImportStatement].join(": "));
      } catch (e) {
        console.error(e);
        vscode.window.showErrorMessage("Failed to parse file.");
      }
    }
  });
  context.subscriptions.push(disposable2);
}

export function deactivate() {}
