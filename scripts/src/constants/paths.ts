import { fileURLToPath } from "node:url";
import { path } from "zx";

const __dirname = fileURLToPath(new URL("./", import.meta.url));

export const WORKSPACE_ROOT = path.join(__dirname, "../../../");

export const CLI_ROOT = path.join(WORKSPACE_ROOT, "./scripts");

export const PAGE_ROOT = path.join(WORKSPACE_ROOT, "./app");
