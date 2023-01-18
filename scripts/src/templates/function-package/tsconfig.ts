type Params = {
  sourceMap: boolean;
};

export const getFunctionTsConfig = ({ sourceMap }: Params) => {
  return `{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "isolatedModules": true,
    "incremental": true,
    "declaration": true,
    "declarationDir": "dist",
    "declarationMap": ${sourceMap ? "true" : "false"},
    "emitDeclarationOnly": true,
  },
  "include": ["src"]
}`;
};
