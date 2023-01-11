import { getNearestPackageJson } from "./getNearestPackageJson";

export const getPackageNameByPath = async (
  path: string
): Promise<string | undefined> => {
  const packageJson = await getNearestPackageJson(path);

  const { name } = JSON.parse(packageJson ?? "{}");
  return name as string | undefined;
};
