import { path } from "zx";
import { getDirName } from "../utils/getDirName.js";

const __dirname = getDirName(import.meta.url);

export const WORKSPACE_ROOT = path.join(__dirname, "../../../");

export const CLI_ROOT = path.join(WORKSPACE_ROOT, "./scripts");

export const PAGE_ROOT = path.join(WORKSPACE_ROOT, "./app");
