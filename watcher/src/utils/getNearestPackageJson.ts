import { readFile, stat } from "node:fs/promises";
import { isAbsolute, parse, resolve } from "node:path";

export const getNearestPackageJsonPath = async (
  path: string
): Promise<string> => {
  const absolutePath = isAbsolute(path) ? path : resolve(path);

  const isMaybePackageJson = absolutePath.includes("package.json");

  try {
    const stats = await stat(absolutePath);
    if (stats.isDirectory() || !isMaybePackageJson) {
      throw Error();
    }

    return absolutePath;
  } catch {
    const { dir } = parse(absolutePath);
    const mayPackageJsonPath = resolve(
      dir,
      isMaybePackageJson ? "../package.json" : "./package.json"
    );
    return getNearestPackageJsonPath(mayPackageJsonPath);
  }
};

export const getNearestPackageJson = async (path: string) => {
  const packageJsonPath = await getNearestPackageJsonPath(path);
  return readFile(packageJsonPath, { encoding: "utf-8" });
};
