export default {
  "@flex-apps/*": {
    includes: ["src/**/*.tsx?"],
    scripts: {
      build: {
        commands: [
          ({ changed }) => {
            return changed.map((name) => `yarn workspace ${name} build`);
          },
        ],
      },
      type: {
        commands: [
          ({ affected }) => {
            const filter = affected
              .map((name) => `--filter=...${name}`)
              .join(" ");
            return `yarn turbo type ${filter}`;
          },
        ],
        clean: "if-file-deleted",
      },
      test: {
        commands: [
          "#build",
          ({ changed }) => {
            return changed.map((name) => `yarn workspace ${name} build`);
          },
        ],
      },
    },
  },
};
