export const getCurrentFileDottedPath = (rootPath: string, currentFilePath: string): string => {
  const relativePath = currentFilePath.replace(rootPath, '');
  const dottedPath = process.platform === 'win32' ? relativePath.replace(/\\/g, '.') : relativePath.replace(/\//g, '.');
  return dottedPath.replace(/\.py$/, '').slice(1);
};