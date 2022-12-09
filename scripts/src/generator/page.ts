import { bufferCount, concatMap, from, map, mergeMap } from "rxjs";
import { $, fs, path, within } from "zx";
import { BuilderCommand } from "../commands/builder.js";
import { CLI_ROOT, PAGE_ROOT } from "../constants/paths.js";
import { BIN_COMMAND } from "../constants/string.js";
import { getFileName } from "../utils/getFileName.js";

type Params = {
  count: number;
  clean?: boolean;
  type?: "simple";
};

const NEXT_APP_PAGE_FOLDER = path.join(PAGE_ROOT, "./pages");
const FILE_GENERATE_GROUP_COUNT = 10;

export const generatePage = async ({
  count,
  type = "simple",
  clean = false,
}: Params) => {
  if (clean) {
    await cleanPage();
    await $`yarn create next-app ${PAGE_ROOT} --ts --no-eslint`;
  }

  const isExistFolder = fs.existsSync(NEXT_APP_PAGE_FOLDER);
  if (!isExistFolder) {
    const initCommand = `${BIN_COMMAND} ${BuilderCommand.paths[0][0]}`;
    throw Error(
      `Next App이 제대로 초기화 되지 않았습니다. \`${initCommand}\`를 실행하세요.`
    );
  }

  switch (type) {
    case "simple":
      return stampAppPageTemplate(count, "simple-page");
    default:
      throw Error(
        `정의 되지 않은 페이지 타입이 입력되었습니다. 입력을 확인하세요.`
      );
  }
};

const cleanPage = () => {
  return fs.remove(PAGE_ROOT);
};

const stampAppPageTemplate = (_count: number, type: string) => {
  return within(() => {
    $.cwd = CLI_ROOT;

    const filePath = path.relative(CLI_ROOT, NEXT_APP_PAGE_FOLDER);

    from(Array.from({ length: _count }, (_, index) => index))
      .pipe(
        bufferCount(FILE_GENERATE_GROUP_COUNT),
        concatMap((group) => {
          return from(group).pipe(
            map((index) => getFileName(index)),
            mergeMap((fileName) => {
              return from(
                $`HYGEN_OVERWRITE=true yarn hygen new ${type} --file_path=${filePath} --file_name=${fileName}`
              );
            })
          );
        })
      )
      .subscribe();
  });
};
