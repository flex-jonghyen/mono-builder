import { Command } from "clipanion";
import { generateApp } from "../generator/app.js";

export class BuilderCommand extends Command {
  static paths = [[`init`], Command.Default];

  async execute(): Promise<number | void> {
    await generateApp({ count: 100, clean: true });
  }
}
