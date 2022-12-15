import path from "node:path";
import { PAGE_ROOT } from "../constants/paths.js";
import { getPageFileName } from "../helpers/getPageFileName.js";
import { Import, ImportScope } from "../types.js";

type ExternalImport = Extract<Import, { type: "external" }>;

type Params = {
  count: number;
  importScope: ImportScope;
  components?: {
    pools: ExternalImport[];
    perCount: number;
  };
  functions?: {
    pools: ExternalImport[];
    perCount: number;
  };
};

type Page = {
  filePath: string;
  imports?: Import[];
};

export const getPages = ({
  count,
  importScope,
  components = { pools: [], perCount: 0 },
  functions = { pools: [], perCount: 0 },
}: Params): Page[] => {
  return Array.from({ length: count })
    .map((_, index) => getPageFileName(index))
    .map((fileName) => path.join(PAGE_ROOT, `./${fileName}`))
    .map((filePath) => ({ filePath }))
    .map((page, index) => {
      let componentImports: Import[] = [];
      if (importScope === "all" || importScope === "component") {
        componentImports = getListWithPage({
          list: components.pools,
          page: index,
          perPage: components.perCount,
        });
      }

      let functionImports: Import[] = [];
      if (importScope === "all" || importScope === "function") {
        functionImports = getListWithPage({
          list: functions.pools,
          page: index,
          perPage: functions.perCount,
        });
      }

      return {
        ...page,
        imports: [...componentImports, ...functionImports],
      };
    });
};

type GetListWithPaginationParams<Item> = {
  list: Item[];
  page: number;
  perPage: number;
};

const getListWithPage = <Item>({
  list,
  page,
  perPage,
}: GetListWithPaginationParams<Item>): Item[] => {
  const start = page * perPage;
  const end = start + perPage;

  if (start < 0 || end > list.length) {
    return [];
  }

  return [...list].slice(start, end);
};
