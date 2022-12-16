import { Command, Option } from "clipanion";
import { config } from "dotenv";
import path from "node:path";
import { WORKSPACE_ROOT } from "../constants/paths.js";
import { getComponents } from "../utils/getComponents.js";
import { getFunctions } from "../utils/getFunctions.js";
import { getPages } from "../utils/getPage.js";
import { parseArgs } from "../utils/parseArgs.js";

config({ path: path.join(WORKSPACE_ROOT, "./.env") });

export class BuilderCommand extends Command {
  static paths = [[`init`], Command.Default];

  pageCount = Option.String("--page-count", { env: "PAGE_COUNT" });
  pageImportScope = Option.String("--page-import-scope", {
    env: "PAGE_IMPORT_SCOPE",
  });

  componentCount = Option.String("--component-count", {
    env: "COMPONENT_COUNT",
  });
  componentPerCount = Option.String("--component-per-count", {
    env: "COMPONENT_PER_COUNT",
  });
  componentImportScope = Option.String("--component-import-scope", {
    env: "COMPONENT_IMPORT_SCOPE",
  });

  functionCount = Option.String("--function-count", {
    env: "FUNCTION_COUNT",
  });
  functionPerCount = Option.String("--function-per-count", {
    env: "FUNCTION_PER_COUNT",
  });
  functionImportScope = Option.String("--function-import-scope", {
    env: "FUNCTION_IMPORT_SCOPE",
  });

  async execute(): Promise<number | void> {
    const { pages, components, functions } = parseArgs({
      pages: { count: this.pageCount, importScope: this.pageImportScope },
      components: {
        count: this.componentCount,
        perCount: this.componentPerCount,
        importScope: this.componentImportScope,
      },
      functions: {
        count: this.functionCount,
        perCount: this.functionPerCount,
        importScope: this.functionImportScope,
      },
    });

    const functions$ = getFunctions({ ...functions });

    const components$ = getComponents({
      ...components,
      functions: { pools: functions$ },
    });

    const pages$ = getPages({
      ...pages,
      components: { pools: components$ },
      functions: { pools: functions$ },
    });

    pages$.subscribe(({ filePath, imports }) => {
      console.log("filePath", filePath);
      imports.subscribe((data) => {
        if (data.type === "external") {
          console.log(data.type, data.packageName);
          data.importedModules.subscribe(({ name, type, imports }) => {
            console.log(name, type);
          });
        }
      });
    });
  }
}
