import { groupByModuleType } from "../../helper/groupByModuleType.js";
import { Module } from "../../types/index.js";

type Params = {
  name: string;
  modules: Module[];
};

export const getNextAppPage = ({ modules, name }: Params) => {
  const { components, functions } = groupByModuleType(modules);

  return `const ${name} = () => {
    ${functions.map((functionName) => `${functionName}();`).join("\n")}
    return (
        <div>
          ${name}
          ${components
            .map((componentName) => `<${componentName} />`)
            .join("\n")}
        </div>
    )
  }
  
  export default ${name}`;
};
