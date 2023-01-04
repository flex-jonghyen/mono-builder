export const getComponentTsConfig = () => {
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
      "jsx": "react-jsx",
      "emitDeclarationOnly": true,
    },
    "include": ["src"]
  }`;
};
