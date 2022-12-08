import { Command } from "clipanion";
import { generatePage } from "../generator/page.js";

export class BuilderCommand extends Command {
  static paths = [[`init`], Command.Default];

  async execute(): Promise<number | void> {
    await generatePage({ count: 5 });
  }
}
