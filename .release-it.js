module.exports = {
  github: {
    release: true,
    releaseName: "Release ${version}",
  },
  npm: {
    publish: false,
  },
  git: {
    tag: true,
    commit: true,
    commitMessage: "chore(release): release ${version}",
  },
  plugins: {
    "@release-it/bumper": {
      in: "package.json",
      out: "src/version.json",
    },
    "@release-it/conventional-changelog": {
      infile: "CHANGELOG.md",
      preset: {
        name: "conventionalcommits",
        types: [
          { type: "feat", section: "Features" },
          { type: "fix", section: "Bug Fixes" },
          { type: "docs", section: "Documentation" },
          { type: "tooling", section: "Tooling" },
          { type: "chore", section: "Internal" },
          { type: "deps", section: "Dependencies" },
          { type: "revert", section: "Reverts" },
        ],
      },
    },
  },
};
