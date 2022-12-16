export type ModuleType = "component" | "function";

export type Module = {
  name: string;
  type: ModuleType;
};

export type Import = Package;

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
};
