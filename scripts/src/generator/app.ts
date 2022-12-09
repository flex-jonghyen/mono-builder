import { bufferCount, concatMap, from, map, mergeMap } from "rxjs";
import { $, fs, path, within } from "zx";
import { CLI_ROOT, PAGE_ROOT } from "../constants/paths.js";
import { getFileName } from "../utils/getFileName.js";

type Params = {
  count: number;
  clean?: boolean;
  type?: "simple";
};

const FILE_GENERATE_GROUP_COUNT = 10;
const appRoot = path.relative(CLI_ROOT, PAGE_ROOT);

export const generateApp = async ({
  count,
  type = "simple",
  clean,
}: Params) => {
  if (clean) {
    await cleanPage();
  }

  switch (type) {
    case "simple":
      return stampAppTemplate(count, "simple-page");
    default:
      throw Error(
        `정의 되지 않은 페이지 타입이 입력되었습니다. 입력을 확인하세요.`
      );
  }
};

const cleanPage = () => {
  return fs.remove(PAGE_ROOT);
};

const stampAppTemplate = (count: number, type: string) => {
  return within(async () => {
    $.cwd = CLI_ROOT;

    await $`HYGEN_OVERWRITE=true yarn hygen new app --file_path=${appRoot}`;

    from(Array.from({ length: count }, (_, index) => index))
      .pipe(
        bufferCount(FILE_GENERATE_GROUP_COUNT),
        concatMap((group) => {
          return from(group).pipe(
            map((index) => getFileName(index)),
            mergeMap((fileName) => {
              const args = [
                [`--file_path`, appRoot],
                [`--file_name`, fileName],
                [
                  `--imports`,
                  `import {} from '@flexteam/a0'\nimport {} from '@flexteam/b1'`,
                ],
              ].map(([key, value]) => `${key}=${value}`);

              return from(
                $`HYGEN_OVERWRITE=true yarn hygen new ${type} ${args}`
              );
            })
          );
        })
      )
      .subscribe();
  });
};
