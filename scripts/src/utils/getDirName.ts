import { fileURLToPath } from "node:url";

export const getDirName = (url: string) => {
  return fileURLToPath(new URL("./", url));
};
