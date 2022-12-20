import { groupByModuleType } from "../../helper/groupByModuleType.js";
import { Module } from "../../types/index.js";

type Params = {
  name: string;
  modules: Module[];
};

export const getComponent = ({ modules, name }: Params) => {
  const { components, functions } = groupByModuleType(modules);

  return `export const ${name} = () => {
    ${functions.map((functionName) => `${functionName};`).join("\n")}
    return (
        <div>
          ${components
            .map((componentName) => `<${componentName} />`)
            .join("\n")}
        </div>
    )
  }`;
};
