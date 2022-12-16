import type { File, Module, ModuleType, Package } from "../types/index.js";

type Pararms = {
  path: string;
  imports: Package[];
  includeModuleCount: number;
  moduleType: ModuleType;
  getModuleName: (type: ModuleType, index: number) => string;
};

export const buildFile = ({
  path,
  imports,
  includeModuleCount,
  moduleType,
  getModuleName,
}: Pararms): File => {
  const exports: Module[] = Array.from({ length: includeModuleCount }).map(
    (_, index) => ({
      name: getModuleName(moduleType, index),
      type: moduleType,
    })
  );

  return {
    path,
    imports,
    exports,
  };
};
