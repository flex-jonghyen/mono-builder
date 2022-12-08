import { Cli } from "clipanion";
import * as commands from "./commands/index.js";

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `flex Monorepo Testbed Builder`,
  binaryName: `mono-builder`,
});

Object.values(commands).forEach((command) => cli.register(command));

cli.runExit(args);
