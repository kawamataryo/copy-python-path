import { describe, expect, it } from "vitest";
import { getRelatedDefinedSymbols } from "./getRelatedDefinedSymbols";

describe("getRelatedDefinedSymbols", () => {
	it("should return all related defined symbols", () => {
		const SOURCE_CODE = `
class ClassA:
    def class_a_method_a():
        pass

    class ClassB:
       def class_b_method_a():
           pass

class ClassD:
    def class_d_method_a():
       pass
`.trim();

		expect(getRelatedDefinedSymbols(SOURCE_CODE, 0)).toEqual(["ClassA"]);
		expect(getRelatedDefinedSymbols(SOURCE_CODE, 1)).toEqual([
			"ClassA",
			"class_a_method_a",
		]);
		expect(getRelatedDefinedSymbols(SOURCE_CODE, 2)).toEqual([]);
		expect(getRelatedDefinedSymbols(SOURCE_CODE, 4)).toEqual([
			"ClassA",
			"ClassB",
		]);
		expect(getRelatedDefinedSymbols(SOURCE_CODE, 5)).toEqual([
			"ClassA",
			"ClassB",
			"class_b_method_a",
		]);
		expect(getRelatedDefinedSymbols(SOURCE_CODE, 8)).toEqual(["ClassD"]);
		expect(getRelatedDefinedSymbols(SOURCE_CODE, 9)).toEqual([
			"ClassD",
			"class_d_method_a",
		]);
	});
});
