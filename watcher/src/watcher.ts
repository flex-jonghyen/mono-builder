import { AsyncSubscription, subscribe } from "@parcel/watcher";
import { $, within } from "zx";
import { getPackageNameByPath } from "./utils/getPackageNameByPath";

let subscription: AsyncSubscription;

export const watch = async () => {
  subscription = await subscribe(process.cwd(), async (error, events) => {
    if (error) {
      throw error;
    }

    const packageNames = await Promise.all(
      events.map(({ path }) => getPackageNameByPath(path))
    );

    const uniquePackageNames = [...new Set(packageNames)];

    within(() => {
      $.env = {
        ...$.env,
        CHANGED_PACKAGES: uniquePackageNames.join(", "),
      };

      console.log($.env["CHANGED_PACKAGES"]);
    });
  });
};

export const disconnect = async () => {
  if (!subscription) {
    throw Error("Watch가 실행된 적이 없습니다.");
  }

  await subscription.unsubscribe();
};
