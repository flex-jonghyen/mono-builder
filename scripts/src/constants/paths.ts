import { fileURLToPath } from "node:url";
import { path } from "zx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export const WORKSPACE_ROOT = path.resolve(__dirname, "../../../");
export const SCRIPTS_ROOT = path.resolve(__dirname, "../../");
export const COMPONENT_ROOT = path.resolve(WORKSPACE_ROOT, "./components");
export const FUNCTION_ROOT = path.resolve(WORKSPACE_ROOT, "./functions");
export const APP_ROOT = path.resolve(WORKSPACE_ROOT, "./apps");
