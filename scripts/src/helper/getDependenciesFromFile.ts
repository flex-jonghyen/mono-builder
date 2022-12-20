import { Dependency, File } from "../types/index.js";

export const getDependenciesFromFiles = (files: File[]): Dependency[] => {
  const dependencyKeys = new Set<string>();
  files.forEach(({ imports }) => {
    imports.forEach(({ name }) => {
      dependencyKeys.add(name);
    });
  });

  return Array.from(dependencyKeys).map((name) => ({
    name,
    version: "workspace:^",
  }));
};
