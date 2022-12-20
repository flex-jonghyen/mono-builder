import { Dependency } from "../../types/index.js";

type Params = {
  packageName: string;
  dependencies: Dependency[];
};

export const getNonBundledFunctionPackageJson = ({
  dependencies,
  packageName,
}: Params) => {
  return `{
    "name": "${packageName}",
    "version": "1.0.0",
    "description": "",
    "main": "./src/index.ts",
    "dependencies": {
        ${dependencies
          .map(({ name, version }) => `"${name}": "${version}"`)
          .join(",\n")}
    },
    "devDependencies": {
      "typescript": "4.9.4"
    }
}`;
};

export const getBundledFunctionPackageJson = ({
  dependencies,
  packageName,
}: Params) => {
  return `{
    "name": "${packageName}",
    "version": "1.0.0",
    "description": "",
    "main": "dist/index.js",
    "module": "dist/es/index.mjs",
    "types": "dist/index.d.ts",
    "dependencies": {
        ${dependencies
          .map(({ name, version }) => `"${name}": "${version}"`)
          .join(",\n")}
    },
    "devDependencies": {
        "typescript": "4.9.4"
    }
}`;
};
