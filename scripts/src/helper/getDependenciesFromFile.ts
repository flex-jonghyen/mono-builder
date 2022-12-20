import { Dependency, File } from "../types/index.js";

export const getDependenciesFromFile = (file: File): Dependency[] => {
  return file.imports.map(({ name }) => ({ name, version: "workspace:^" }));
};
