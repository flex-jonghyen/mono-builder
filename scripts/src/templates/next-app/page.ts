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

  ${name}.getInitialProps = async () => {
    fetch('/api/hello').then((res) => res.json()).then((data) => console.log(data))
  }
  
  export default ${name}`;
};
