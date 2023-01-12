import { AsyncSubscription, Options, subscribe } from "@parcel/watcher";
import { getPackageNameByPath } from "../utils/getPackageNameByPath";
import { Runner } from "./Runner";
import { TaskQueue } from "./TaskQueue";

type SubscribeParams = {
  scope?: string;
  commands: string[];
  options?: Options;
};

export class Watcher {
  private queue: TaskQueue;
  private runner: Runner;

  private subscription: AsyncSubscription | null = null;

  constructor() {
    this.queue = new TaskQueue();
    this.runner = new Runner(this.queue);
  }

  public async subscribe({
    scope = process.cwd(),
    commands,
    options,
  }: SubscribeParams) {
    this.subscription = await subscribe(
      scope,
      async (error, events) => {
        if (error) {
          throw error;
        }

        const packageNames = await Promise.all(
          events.map(({ path }) => getPackageNameByPath(path))
        );

        const uniquePackageNames = [...new Set(packageNames)];
        const changedPackages = uniquePackageNames;
        const affectedPackages = uniquePackageNames.map((name) => `...${name}`);

        commands.map((command) => {
          console.log(command);
          this.queue.enqueue({
            command,
            env: {
              CHANGED_PACKAGES: changedPackages.join(","),
              AFFECTED_PACKAGES: affectedPackages.join(","),
            },
          });
        });

        await this.runner.proccess();
      },
      options
    );
  }

  public async unsubscribe() {
    if (this.subscription) {
      await this.subscription.unsubscribe();
    }
  }
}
