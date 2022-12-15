import path from "node:path";
import { from, map, merge, Observable, of, skip, take } from "rxjs";
import { PAGE_ROOT } from "../constants/paths.js";
import { getPageFileName } from "../helpers/page-namegens.js";
import { Export, Import, ImportScope } from "../types.js";

type Params = {
  count: number;
  importScope: ImportScope;
  components?: {
    pools: Observable<Export>;
  };
  functions?: {
    pools: Observable<Export>;
  };
};

type Page = {
  filePath: string;
  imports: Observable<Import>;
};

const PER_PAGE = 10;

export const getPages = ({
  count,
  importScope,
  components,
  functions,
}: Params): Observable<Page> => {
  return from(Array.from({ length: count })).pipe(
    map((_, index) => getPageFileName(index)),
    map((fileName) => path.join(PAGE_ROOT, `./pages/${fileName}`)),
    map((filePath) => ({ filePath })),
    map((page, index) => {
      const start = index * PER_PAGE;
      let componentImports$: Observable<Import> | undefined;
      if (importScope === "all" || importScope === "component") {
        componentImports$ = components?.pools.pipe(
          skip(start),
          take(PER_PAGE),
          map(({ exportedModules, pathOrPackageName }) => {
            return {
              type: "external",
              packageName: pathOrPackageName,
              importedModules: exportedModules,
            };
          })
        );
      }

      let functionImports$: Observable<Import> | undefined;
      if (importScope === "all" || importScope === "function") {
        functionImports$ = functions?.pools.pipe(
          skip(start),
          take(PER_PAGE),
          map(({ exportedModules, pathOrPackageName }) => {
            return {
              type: "external",
              packageName: pathOrPackageName,
              importedModules: exportedModules,
            };
          })
        );
      }

      return {
        ...page,
        imports: merge(componentImports$ ?? of(), functionImports$ ?? of()),
      };
    })
  );
};
