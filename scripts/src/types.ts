import { Observable } from "rxjs";

export type Module = {
  type: "component" | "function";
  name: string;
  imports?: Observable<Import>;
};

export type Import =
  | {
      type: "internal";
      path: string;
      importedModules: Observable<Module>;
    }
  | {
      type: "external";
      packageName: string;
      importedModules: Observable<Module>;
    };

export type Export = {
  pathOrPackageName: string;
  exportedModules: Observable<Module>;
};

export type ImportScope = "component" | "function" | "all";
