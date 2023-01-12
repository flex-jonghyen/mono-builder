import { Watcher } from "./core/Watcher";

const main = async () => {
  const watcher = new Watcher();
  await watcher.subscribe({
    commands: [
      "yarn turbo build --filter=$CHANGED_PACKAGES --filter=!@flex-apps/people --only",
      "yarn turbo type --filter=$AFFECTED_PACKAGES --filter=!@flex-apps/people --only",
    ],
    options: {
      ignore: ["!**/src/**"],
    },
  });
};

main();
