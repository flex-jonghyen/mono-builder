import { z } from "zod";
type Args = {
  pages: {
    count?: string;
    importScope?: string;
  };
  components: {
    count?: string;
    perCount?: string;
    importScope?: string;
  };
  functions: {
    count?: string;
    perCount?: string;
    importScope?: string;
  };
};

export const parseArgs = (args: Args) => {
  return z
    .object({
      pages: z.object({
        count: numericString,
        importScope,
      }),
      components: z.object({
        count: numericString,
        perCount: numericString,
        importScope,
      }),
      functions: z.object({
        count: numericString,
        perCount: numericString,
        importScope,
      }),
    })
    .parse(args);
};

const numericString = z
  .string()
  .transform((value: string, ctx: z.RefinementCtx) => {
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "입력된 값이 숫자가 아닙니다.",
      });
      return z.NEVER;
    }

    if (parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "숫자는 0보다 커야 합니다.",
      });
      return z.NEVER;
    }

    return parsed;
  });

const importScope = z.enum(["component", "function", "all"]);
