import { Dependency } from "../../../types/index.js";

type Params = {
  packageName: string;
  dependencies: Dependency[];
};

export const getNextAppPackageJson = ({
  packageName,
  dependencies,
}: Params) => {
  return `{
    "name": "${packageName}",
    "version": "1.0.0",
    "description": "",
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start"
    },
    "dependencies": {
      "next": "^12.3.2",
      "react": "18.2.0",
      "react-dom": "18.2.0",
        ${dependencies
          .map(({ name, version }) => `"${name}": "${version}"`)
          .join(",\n")}
    },
    "devDependencies": {
        "@types/node": "18.11.12",
        "@types/react": "18.0.26",
        "@types/react-dom": "18.0.9",
        "typescript": "4.9.4",
        "source-map-loader": "^4.0.1"
    }
  }
`;
};
