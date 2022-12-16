import { from, map, skip, take, type Observable } from "rxjs";
import {
  getComponentFileName,
  getComponentPackageName,
} from "../helpers/component-namegens.js";
import type { Export, Import, ImportScope } from "../types.js";

type Params = {
  count: number;
  perCount: number;
  importScope: ImportScope;
  functions?: {
    pools: Observable<Export>;
  };
};

const PER_PAGE = 10;

export const getComponents = ({
  count,
  perCount,
  importScope,
  functions,
}: Params): Observable<Export> => {
  return from(Array.from({ length: count })).pipe(
    map((_, packageIndex) => {
      const packageName = getComponentPackageName(packageIndex);
      return {
        pathOrPackageName: packageName,
        exportedModules: from(Array.from({ length: perCount })).pipe(
          map((_, fileIndex) => getComponentFileName(packageIndex, fileIndex)),
          map((fileName, fileIndex) => {
            const start = fileIndex * PER_PAGE;

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
              type: "component",
              name: fileName,
              imports: functionImports$,
            };
          })
        ),
      };
    })
  );
};
