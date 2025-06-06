import { basename } from "node:path";

export const getCurrentFileDottedPath = (params: {
  rootPath: string;
  currentFilePath: string;
  shouldAddModuleRootName: boolean | undefined;
  omitRootPath: string | undefined;
}): string => {
  const relativePath = params.currentFilePath.replace(params.rootPath, "");
  const dottedPathWithExtension =
    process.platform === "win32" ? relativePath.replace(/\\/g, ".") : relativePath.replace(/\//g, ".");
  const dottedPath = dottedPathWithExtension.replace(/\.py$/, "").slice(1);

  let finalPath = dottedPath;
  if (params.shouldAddModuleRootName) {
    const moduleRootName = basename(params.rootPath);
    finalPath = [moduleRootName, dottedPath].join(".");
  }

  if (params.omitRootPath && params.omitRootPath.length > 0) {
    // Handle omission of root path
    if (finalPath === params.omitRootPath) {
      // If the path is exactly the omitRootPath, return empty string
      finalPath = "";
    } else if (finalPath.startsWith(`${params.omitRootPath}.`)) {
      // If the path starts with omitRootPath followed by a dot, remove that prefix
      finalPath = finalPath.slice(params.omitRootPath.length + 1);
    }
  }

  return finalPath;
};
