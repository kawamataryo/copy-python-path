import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

const SAMPLE_CODE = `
class ClassA:
	def class_a_method_a:
		pass
class ClassB:
	def class_b_method_a:
		pass
	def class_b_method_b:
		pass
	class ClassC:
		def class_c_method_a:
`

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		// vscode.workspace.openTextDocument({ language: 'python', content: SAMPLE_CODE });
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
