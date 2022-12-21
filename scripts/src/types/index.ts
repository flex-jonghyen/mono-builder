export type ModuleType = "component" | "function" | "page";

export type Module = {
  name: string;
  type: ModuleType;
};

export type Import = Omit<Package, "ratio">;

export type Export = Module;

export type File = {
  path: string;
  imports: Import[];
  exports: Export[];
};

export type Package = {
  name: string;
  files: File[];
  type: ModuleType;
  bundled: boolean;
  importRatio: number;
};

export type App = Omit<Package, "bundled" | "type">;

export type Dependency = {
  name: string;
  version: string;
};
