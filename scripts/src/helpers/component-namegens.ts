export const getComponentFileName = (
  packageIndex: number,
  fileIndex: number
) => {
  return `Component${packageIndex}${fileIndex}.tsx`;
};

export const getComponentPackageName = (index: number) => {
  return `@flexteam/component-${index}`;
};
