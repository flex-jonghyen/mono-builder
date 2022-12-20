import { fs } from "zx";
import type { File, Module } from "../types/index.js";

type Params = File & {
  getFileTemplate: (params: { name: string; modules: Module[] }) => string;
};

export const generateFile = ({
  exports,
  imports,
  path,
  getFileTemplate,
}: Params): Promise<void> => {
  const flattenImports = imports.map(({ name, files }) => {
    const modules = files.flatMap(({ exports }) => exports);
    return { name, modules };
  });

  const importSyntax = flattenImports
    .map(({ modules, name }) => {
      const moduleNames = modules.map(({ name }) => name);
      return `import { ${moduleNames.join(", ")} } from "${name}";`;
    })
    .join("\n");

  const importModulePool = flattenImports.flatMap(({ modules }) => modules);
  const perModule = Math.ceil(importModulePool.length / exports.length);

  const modulesSyntax = exports
    .map(({ name, type }, index) => {
      const start = index * perModule;
      const end = start + perModule;
      const target = importModulePool.slice(start, end);

      const params = { name, modules: target };

      return getFileTemplate(params);
    })
    .join("\n");

  const contents = [importSyntax, modulesSyntax].join("\n\n");
  return fs.writeFile(path, contents);
};
