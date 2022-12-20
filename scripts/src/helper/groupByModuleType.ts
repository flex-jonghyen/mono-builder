import { Module, ModuleType } from "../types/index.js";

type Key = `${ModuleType}s`;
type Return = Record<Key, Module[]>;

export const groupByModuleType = (modules: Module[]): Return => {
  const keys: ModuleType[] = ["component", "function"];
  const initial = Object.fromEntries(
    keys.map((key) => [`${key}s`, []] as [Key, Module[]])
  ) as Return;

  return modules.reduce((prev, { name, type }) => {
    const key: Key = `${type}s`;
    const selected = prev[key];
    return {
      ...prev,
      [key]: [...selected, name],
    };
  }, initial);
};
