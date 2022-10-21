import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

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

const COMMAND_NAME = 'copy-python-path.copy-python-path';
const COMMAND_IMPORT_NAME = "copy-python-path.copy-python-import-statement";

const testFileLocation = '/pythonApp/example.py';
/* test file is following code
class ClassA:
    def class_a_method_a():
        pass

    class ClassB:
       def class_b_method_a():
           pass

class ClassD:
    def class_d_method_a():
       pass
*/

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');
  let editor: vscode.TextEditor;

  setup(async () => {
    // open folder
    const fileUri = vscode.Uri.file(vscode.workspace.workspaceFolders![0].uri.fsPath + testFileLocation);
    const document = await vscode.workspace.openTextDocument(fileUri);
    editor = await vscode.window.showTextDocument(document);
  });

  test('selected class lines', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));

    await executeCommandWithWait(COMMAND_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'pythonApp.example.ClassA');
  });

  test('selected method lines', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(1, 0), new vscode.Position(1, 0));

    await executeCommandWithWait(COMMAND_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'pythonApp.example.ClassA.class_a_method_a');
  });

  test('selected nested class lines', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(4, 0), new vscode.Position(4, 0));

    await executeCommandWithWait(COMMAND_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'pythonApp.example.ClassA.ClassB');
  });

  test('selected nested method lines', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(5, 0), new vscode.Position(5, 0));

    await executeCommandWithWait(COMMAND_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'pythonApp.example.ClassA.ClassB.class_b_method_a');
  });

  test('selected other class lines', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(9, 0), new vscode.Position(9, 0));

    await executeCommandWithWait(COMMAND_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'pythonApp.example.ClassD');
  });

  test('selected lines other than symbol', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(12, 0), new vscode.Position(12, 0));

    await executeCommandWithWait(COMMAND_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'pythonApp.example');
  });
  test('from import stmt is correctly generated for classA', async () => {
    editor.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));

    await executeCommandWithWait(COMMAND_IMPORT_NAME);

    assert.strictEqual(await vscode.env.clipboard.readText(), 'from pythonApp.example import ClassA');
  });
});
