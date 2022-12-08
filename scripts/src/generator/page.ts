import { faker } from "@faker-js/faker";
import { $, fs, path, within } from "zx";
import { BuilderCommand } from "../commands/builder.js";
import { CLI_ROOT, PAGE_ROOT, WORKSPACE_ROOT } from "../constants/paths.js";
import { BIN_COMMAND } from "../constants/string.js";

type Params = {
  count: number;
  clean?: boolean;
  type?: "simple";
};

const NEXT_APP_PAGE_FOLDER = path.join(PAGE_ROOT, "./pages");

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

const stampAppPageTemplate = (count: number, type: string) => {
  return within(async () => {
    $.cwd = CLI_ROOT;
    return Promise.all(
      Array.from({ length: count }).map((_) => {
        const appPageFolder = path.join(WORKSPACE_ROOT, "./app/pages");

        const filePath = path.relative(CLI_ROOT, appPageFolder);
        const fileName = faker.word.noun();
        return $`HYGEN_OVERWRITE=true yarn hygen new ${type} --file_path=${filePath} --file_name=${fileName}`;
      })
    );
  });
};
