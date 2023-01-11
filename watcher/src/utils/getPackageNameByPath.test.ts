import { describe, expect, it } from "vitest";
import { getPackageNameByPath } from "./getPackageNameByPath.js";

describe("Test getPackageNameByPath", () => {
  it("Basic Test", async () => {
    const packageName = await getPackageNameByPath(
      "/Users/grapgrap/workspace/esm-test/watcher/src/utils/getNearestPackageJson.mts"
    );

    expect(packageName).toEqual("@flexteam/watcher");
  });
});
