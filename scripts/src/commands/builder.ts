import { Command } from "clipanion";

export class BuilderCommand extends Command {
  static paths = [[`init`], Command.Default];

  async execute(): Promise<number | void> {}
}
