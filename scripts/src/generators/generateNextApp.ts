import { fs, path } from "zx";
import { APP_ROOT } from "../constants/paths.js";
import { chunkPromiseAll } from "../helper/chunkPromiseAll.js";
import { getDependenciesFromFiles } from "../helper/getDependenciesFromFile.js";
import { getNextAppConfig } from "../templates/next-app/defaults/nextConfig.js";
import { getNextAppEnvDts } from "../templates/next-app/defaults/nextEnvDts.js";
import { getNextAppPackageJson } from "../templates/next-app/defaults/packageJson.js";
import { getNextAppTsConfig } from "../templates/next-app/defaults/tsconfig.js";
import { getNextAppAppPage } from "../templates/next-app/defaults/_app.js";
import { getNextAppPage } from "../templates/next-app/page.js";
import { App } from "../types/index.js";
import { generateFile } from "./generateFile.js";

type Pararms = App;

export const generateNextApp = async ({ files, name }: Pararms) => {
  const dependencies = getDependenciesFromFiles(files);

  const packageJson = getNextAppPackageJson({
    packageName: `@flex-apps/${name}`,
    dependencies,
  });
  const tsconfig = getNextAppTsConfig();
  const nextEnvDts = getNextAppEnvDts();
  const nextConfig = getNextAppConfig();

  const appDir = path.join(APP_ROOT, `./${name}`);

  // Generate Root Files
  await fs.ensureDir(appDir);
  await Promise.all([
    fs.writeFile(path.join(appDir, "./package.json"), packageJson),
    fs.writeFile(path.join(appDir, "./tsconfig.json"), tsconfig),
    fs.writeFile(path.join(appDir, "./next-env.d.ts"), nextEnvDts),
    fs.writeFile(path.join(appDir, "./next.config.js"), nextConfig),
  ]);

  const pageDir = path.join(appDir, "./pages");
  const appPage = getNextAppAppPage();

  // Generate Page Files
  await fs.ensureDir(pageDir);
  await fs.writeFile(path.join(pageDir, "./_app.tsx"), appPage);
  await chunkPromiseAll({
    promises: files
      .map(({ path: _path, ...rest }) => ({
        path: path.join(pageDir, `${_path}`),
        ...rest,
      }))
      .map((file) =>
        generateFile({ ...file, getFileTemplate: getNextAppPage })
      ),
    chunk: 10,
  });
};
