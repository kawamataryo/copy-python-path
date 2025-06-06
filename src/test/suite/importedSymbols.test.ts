import * as assert from "node:assert";
import * as vscode from "vscode";
import * as path from "node:path";
import * as fs from "node:fs";

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const executeCommandWithWait = async (command: string): Promise<any> => {
  await sleep(500);
  await vscode.commands.executeCommand(command);
  await sleep(1000);
};

const COMMAND_NAME = "copy-python-path.copy-python-path";
const COMMAND_IMPORT_NAME = "copy-python-path.copy-python-import-statement";

// Path for our test file with imports
const importedSymbolsTestFile = "/pythonApp/imported_symbols_test.py";

suite("Imported Symbols Feature Tests", () => {
  vscode.window.showInformationMessage("Starting imported symbols tests.");
  let editor: vscode.TextEditor;

  // Set up our test file with imports
  suiteSetup(async () => {
    const fixturePath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, "pythonApp");
    const testFilePath = path.join(fixturePath, "imported_symbols_test.py");

    // Create test file content
    const testFileContent = `
from typing import List, Dict, Optional
import os, sys
from datetime import datetime as dt
import pandas as pd

def some_function():
    data = List[Dict[str, str]]
    timestamp = dt.now()
    cwd = os.getcwd()
    df = pd.DataFrame()
`;

    // Write test file
    fs.writeFileSync(testFilePath, testFileContent);
  });

  setup(async () => {
    // Open the test file
    const fileUri = vscode.Uri.file(vscode.workspace.workspaceFolders![0].uri.fsPath + importedSymbolsTestFile);
    const document = await vscode.workspace.openTextDocument(fileUri);
    editor = await vscode.window.showTextDocument(document);
  });

  // Clean up test file
  suiteTeardown(async () => {
    const testFilePath = path.join(
      vscode.workspace.workspaceFolders![0].uri.fsPath,
      "pythonApp",
      "imported_symbols_test.py"
    );
    fs.unlinkSync(testFilePath);
  });

  test("should copy path of imported symbol (from module import symbol)", async () => {
    // Position cursor on "List" in the function body - corrected position
    editor.selection = new vscode.Selection(new vscode.Position(7, 12), new vscode.Position(7, 12));
    await executeCommandWithWait(COMMAND_NAME);

    const clipboardText = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboardText, "typing.List");
  });

  test("should copy path of imported symbol with alias", async () => {
    // Position cursor on "dt" in the function body
    editor.selection = new vscode.Selection(new vscode.Position(8, 16), new vscode.Position(8, 16));
    await executeCommandWithWait(COMMAND_NAME);

    const clipboardText = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboardText, "datetime.datetime");
  });

  test("should copy path of directly imported module", async () => {
    // Position cursor on "os" in the function body
    editor.selection = new vscode.Selection(new vscode.Position(9, 10), new vscode.Position(9, 10));
    await executeCommandWithWait(COMMAND_NAME);

    const clipboardText = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboardText, "os");
  });

  test("should generate import statement for imported symbol", async () => {
    // Position cursor on "pd" in the function body
    editor.selection = new vscode.Selection(new vscode.Position(10, 9), new vscode.Position(10, 9));
    await executeCommandWithWait(COMMAND_IMPORT_NAME);

    const clipboardText = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboardText, "import pandas");
  });

  test("should fall back to original behavior when cursor is not on imported symbol", async () => {
    // Position cursor on "some_function" definition
    editor.selection = new vscode.Selection(new vscode.Position(6, 5), new vscode.Position(6, 5));
    await executeCommandWithWait(COMMAND_NAME);

    const clipboardText = await vscode.env.clipboard.readText();
    assert.ok(clipboardText.endsWith("pythonApp.imported_symbols_test.some_function"));
  });
});
