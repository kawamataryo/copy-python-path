export const getCurrentFileDottedPath = (rootPath: string, filename: string): string => {
  const relativePath = filename.replace(rootPath, '');
  const dottedPath = process.platform === 'win32' ? relativePath.replace(/\\/g, '.') : relativePath.replace(/\//g, '.');
  return dottedPath.replace(/\.py$/, '').slice(1);
};