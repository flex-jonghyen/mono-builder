import { Watcher } from "./core";

export const subscribe: Watcher["subscribe"] = async (params) => {
  const watcher = new Watcher();
  await watcher.subscribe(params);
};
