import { groupByModuleType } from "../../helper/groupByModuleType.js";
import { Module } from "../../types/index.js";

type Params = {
  name: string;
  modules: Module[];
};

export const getNextAppPage = ({ modules, name }: Params) => {
  const { components, functions } = groupByModuleType(modules);

  return `
  type Props = { ditto: string }
  const ${name} = ({ ditto }: Props) => {
    ${functions.map((functionName) => `${functionName}();`).join("\n")}
    return (
        <div>
          <h1>{ditto}</h1>
          ${name}
          ${components
            .map((componentName) => `<${componentName} />`)
            .join("\n")}
        </div>
    )
  }

  ${name}.getInitialProps = async () => {
    const ditto = await fetch('https://pokeapi.co/api/v2/pokemon/ditto').then((res) => res.json());
    return {
      props: {
        name: '${name}',
        ditto: ditto.name
      }
    }
  }
  
  export default ${name}`;
};
