import { describe, expect, it } from "vitest";
import { getImportedSymbolMap } from "./getImportedSymbolMap";

describe("getImportedSymbolMap", () => {
  it("should parse from-import statements", () => {
    const sourceCode = `
from module.path import Symbol, AnotherSymbol
from another.module import ThirdSymbol as Alias
    `.trim();

    const symbolMap = getImportedSymbolMap(sourceCode);

    expect(symbolMap.get("Symbol")).toBe("module.path.Symbol");
    expect(symbolMap.get("AnotherSymbol")).toBe("module.path.AnotherSymbol");
    expect(symbolMap.get("Alias")).toBe("another.module.ThirdSymbol");
  });

  it("should parse import statements", () => {
    const sourceCode = `
import module.path.Symbol
import another.module.ThirdSymbol as Alias
    `.trim();

    const symbolMap = getImportedSymbolMap(sourceCode);

    expect(symbolMap.get("Symbol")).toBe("module.path.Symbol");
    expect(symbolMap.get("Alias")).toBe("another.module.ThirdSymbol");
  });

  it("should handle multiple import statements", () => {
    const sourceCode = `
import os, sys
from typing import List, Optional, Dict
import json as JSON
    `.trim();

    const symbolMap = getImportedSymbolMap(sourceCode);

    expect(symbolMap.get("os")).toBe("os");
    expect(symbolMap.get("sys")).toBe("sys");
    expect(symbolMap.get("List")).toBe("typing.List");
    expect(symbolMap.get("Optional")).toBe("typing.Optional");
    expect(symbolMap.get("Dict")).toBe("typing.Dict");
    expect(symbolMap.get("JSON")).toBe("json");
  });

  it("should handle complex examples", () => {
    const sourceCode = `
from ml_service.lms.models.course_builder import CreateCourseQuizRequest
import pandas as pd, numpy as np
    `.trim();

    const symbolMap = getImportedSymbolMap(sourceCode);

    expect(symbolMap.get("CreateCourseQuizRequest")).toBe(
      "ml_service.lms.models.course_builder.CreateCourseQuizRequest"
    );
    expect(symbolMap.get("pd")).toBe("pandas");
    expect(symbolMap.get("np")).toBe("numpy");
  });
});
