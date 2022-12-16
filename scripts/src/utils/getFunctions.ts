import { from, map, Observable } from "rxjs";
import {
  getFunctionFileName,
  getFunctionPackageName,
} from "../helpers/function-namegens.js";
import type { Export, ImportScope } from "../types.js";

type Params = {
  count: number;
  perCount: number;
  importScope: ImportScope;
};

export const getFunctions = ({
  count,
  perCount,
}: Params): Observable<Export> => {
  return from(Array.from({ length: count })).pipe(
    map((_, packageIndex) => {
      const packageName = getFunctionPackageName(packageIndex);
      return {
        pathOrPackageName: packageName,
        exportedModules: from(Array.from({ length: perCount })).pipe(
          map((_, fileIndex) => getFunctionFileName(packageIndex, fileIndex)),
          map((fileName) => {
            return {
              type: "function",
              name: fileName,
              imports: undefined,
            };
          })
        ),
      };
    })
  );
};
