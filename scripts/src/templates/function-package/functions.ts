import { Module } from "../../types/index.js";

type Params = {
  name: string;
  modules: Module[];
};

export const getFunction = ({ modules, name }: Params) => {
  if (modules.length > 0 && modules.every(({ type }) => type !== "function")) {
    throw TypeError("[getFunction]: 함수 파일에는 함수만 포함되어야 합니다.");
  }

  return `export const ${name} = () => {
  ${modules.map(({ name: functionName }) => `${functionName};`).join("\n")}
}`;
};
