import minimist from "minimist";
import { z } from "zod";
import { subscribe } from "../subscribe";

const argv = minimist(process.argv.slice(2));

const stringOrStringArray = z
  .union([z.string(), z.string().array()])
  .transform((value) => [value].flat());

const { scope, commands, includes } = z
  .object({
    scope: z.string().optional(),
    commands: stringOrStringArray,
    includes: stringOrStringArray,
  })
  .parse(argv);

const main = async () => {
  const ignore = includes.map((pattern) => `!${pattern}`);
  await subscribe({
    scope,
    commands,
    options: { ignore },
  });
};

main();
