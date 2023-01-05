import { Dependency } from "../../types/index.js";

type Params = {
  packageName: string;
  dependencies: Dependency[];
};

export const getNonBundledComponentPackageJson = ({
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
      "typescript": "4.9.4",
      "@types/react": "18.0.26",
      "@types/react-dom": "18.0.9",
    },
    "peerDependencies": {
      "react": "*",
      "react-dom": "*"
    }
}`;
};

export const getBundledComponentPackageJson = ({
  dependencies,
  packageName,
}: Params) => {
  return `{
    "name": "${packageName}",
    "version": "1.0.0",
    "description": "",
    "type": "module",
    "module": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
      "build": "rollup --config rollup.config.mjs",
      "dev": "yarn build --watch",
      "type": "tsc -p tsconfig.json"
    },
    "dependencies": {
        ${dependencies
          .map(({ name, version }) => `"${name}": "${version}"`)
          .join(",\n")}
    },
    "devDependencies": {
        "typescript": "4.9.4",
        "@types/react": "18.0.26",
        "@types/react-dom": "18.0.9",
        "@flexteam/bundler": "workspace:^",
        "esbuild": "0.16.12",
        "rollup": "^3.9.1"
    },
    "peerDependencies": {
        "react": "*",
        "react-dom": "*"
    }
}`;
};
