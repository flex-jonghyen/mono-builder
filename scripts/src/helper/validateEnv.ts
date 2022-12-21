import { parse } from "dotenv";
import { PathLike } from "fs";
import { fs } from "zx";

type Params<T, Value = Record<string, unknown>> = {
  values: Value;
  exampleFile: PathLike;
  validateValue: (value: Value) => T;
};

export const validateEnv = async <T>({
  exampleFile,
  validateValue,
  values,
}: Params<T>): Promise<T> => {
  const envExample = await fs.readFile(exampleFile, "utf8");
  const example = parse(envExample);

  if (hasDiffKeys(example, values)) {
    throw new Error(
      "Some keys are missing in the .env file. Please check the .env.example file."
    );
  }

  return validateValue(values);
};

const hasDiffKeys = (
  first: Record<string, unknown>,
  seconds: Record<string, unknown>
) => {
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(seconds);

  return firstKeys.some((key) => !secondKeys.includes(key));
};
