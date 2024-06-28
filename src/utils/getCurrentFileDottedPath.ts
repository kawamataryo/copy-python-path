import { basename } from "node:path";

export const getCurrentFileDottedPath = (params: {
	rootPath: string;
	currentFilePath: string;
	shouldAddModuleRootName: boolean | undefined;
}): string => {
	const relativePath = params.currentFilePath.replace(params.rootPath, "");
	const dottedPathWithExtension =
		process.platform === "win32"
			? relativePath.replace(/\\/g, ".")
			: relativePath.replace(/\//g, ".");
	const dottedPath = dottedPathWithExtension.replace(/\.py$/, "").slice(1);

	if (params.shouldAddModuleRootName) {
		const moduleRootName = basename(params.rootPath);
		return [moduleRootName, dottedPath].join(".");
	}
	return dottedPath;
};
