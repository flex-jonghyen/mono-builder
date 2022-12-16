import { Module } from "../../types/index.js";

type Params = {
  name: string;
  modules: Module[];
};

export const getComponent = ({ modules, name }: Params) => {
  const { components, functions } = modules.reduce(
    (
      { components, functions }: { components: string[]; functions: string[] },
      { name: moduleName, type }
    ) => {
      if (type === "component") {
        components.push(moduleName);
      } else {
        functions.push(moduleName);
      }
      return { components, functions };
    },
    {
      components: [],
      functions: [],
    }
  );

  return `export const ${name} = () => {
    ${functions.map((functionName) => `${functionName}();`).join("\n")}
    return (
        <div>
          ${name}
          ${components
            .map((componentName) => `<${componentName} />`)
            .join("\n")}
        </div>
    )
  }`;
};
