export type Module = {
  type: "component" | "function";
  name: string;
};

export type Import =
  | {
      type: "internal";
      path: string;
      importedModules: Module[];
    }
  | {
      type: "external";
      packageName: string;
      importedModules: Module[];
    };

export type ImportScope = "component" | "function" | "all";
