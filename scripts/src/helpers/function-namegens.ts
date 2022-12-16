export const getFunctionFileName = (
  packageIndex: number,
  fileIndex: number
) => {
  return `getFunction${packageIndex}${fileIndex}.tsx`;
};

export const getFunctionPackageName = (index: number) => {
  return `@flexteam/function-${index}`;
};
