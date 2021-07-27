module.exports = {
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "packages/version/version.json",
      type: "json",
    },
  ],
  types: [
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
    { type: "chore", section: "Internal" },
    { type: "wip", hidden: true },
    { type: "test", hidden: true },
    { type: "perf", hidden: true },
    { type: "docs", hidden: true },
    { type: "tooling", section: "Tooling" },
    { type: "revert", section: "Reverts" },
  ],
};
