import { describe, expect, it } from "vitest";
import { getNearestPackageJsonPath } from "./getNearestPackageJson.js";

describe("Test getNearestPackageJson", () => {
  it("When file path", async () => {
    const path = await getNearestPackageJsonPath(
      "/Users/grapgrap/workspace/esm-test/watcher/src/utils/getNearestPackageJson.mts"
    );
    expect(path).toEqual(
      "/Users/grapgrap/workspace/esm-test/watcher/package.json"
    );
  });

  it("When dir path", async () => {
    const path = await getNearestPackageJsonPath(
      "/Users/grapgrap/workspace/esm-test/watcher/src/utils"
    );
    expect(path).toEqual(
      "/Users/grapgrap/workspace/esm-test/watcher/package.json"
    );
  });
});
