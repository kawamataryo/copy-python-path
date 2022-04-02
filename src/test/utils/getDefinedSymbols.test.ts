import * as assert from 'assert';
import { getDefinedSymbols } from '../../utils/getDefinedSymbols';

suite("getDefinedSymbols", function () {

  /*
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
  */
  const symbols = [
    { name: 'ClassA', line: 1, column: 0 },
    { name: 'class_a_method_a', line: 2, column: 2 },
    { name: 'ClassB', line: 4, column: 0 },
    { name: 'class_b_method_a', line: 5, column: 2 },
    { name: 'class_b_method_b', line: 7, column: 2 },
    { name: 'ClassC', line: 9, column: 2 },
    { name: 'class_c_method_a', line: 10, column: 4 },
  ];

  test("get symbols in order of definition", function () {
    assert.deepStrictEqual(getDefinedSymbols(symbols, 1), ['ClassA']);
    assert.deepStrictEqual(getDefinedSymbols(symbols, 2), ['ClassA', 'class_a_method_a']);
    assert.deepStrictEqual(getDefinedSymbols(symbols, 7), ['ClassB', 'class_b_method_b']);
    assert.deepStrictEqual(getDefinedSymbols(symbols, 10), ['ClassB', 'ClassC', 'class_c_method_a']);
  });
});