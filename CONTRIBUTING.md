# Contributing guide

Contributions are welcome.

[Help guide](https://github.com/firstcontributions/first-contributions)

TODO: add a more detailed contributing guide!

## <a name="branching-strategy"> Branching strategy

This project uses the [GitFlow
workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

## <a name="typescript-style-guide"> TypeScript Style guide

All TypeScript code is linted with [Prettier](https://prettier.io/). Most
configuration settings are set to [the recommended
defaults](https://prettier.io/docs/en/options.html). Please see `.prettierrc.yaml`
for any customised configuration.

## <a name="commit-message-format"></a> Commit Message Format

> Inspired by the
> [AngularJS contributing guide](https://github.com/angular/angular/blob/master/CONTRIBUTING.md).

Each commit message consists of a header, a body, and a footer.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the
[Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs". When the
body is present it must be at least 20 characters long and must conform to the
[Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format
describes what the footer is used for and the structure it must have.

Any line of the commit message cannot be longer than 100 characters.

### <a name="commit-header"></a> Commit Message Header

```
<type>: <short summary>
  │       │
  │       └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │
  └─⫸ Commit Type: feat|fix|chore|test|perf|docs|tooling|revert
```

The `<type>` and `<summary>` fields are mandatory, the (`<scope>`) field is optional.

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **chore**: Code maintenance changes that do not change functionality
- **wip**: Work in progress commit
- **test**: Add missing tests or correcting existing tests
- **perf**: A code change that improves performance
- **docs**: Documentation only changes
- **tooling**: Changes that affect the development tooling or build
  scripts/configuration
- **revert**: Reverts a previous commit

#### Summary

Use the summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### <a name="commit-footer"></a>Commit Message Footer

The footer can contain information about breaking changes and is also the place to
reference GitHub issues, Jira tickets, and other PRs that this commit closes or is
related to.

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by
a summary of the breaking change, a blank line, and a detailed description of the
breaking change that also includes migration instructions.

### <a name='revert-commits'></a> Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by
the header of the reverted commit.

The content of the commit message body should contain:

- information about the SHA of the commit being reverted in the following format:
  `This reverts commit <SHA>`,
- a clear description of the reason for reverting the commit message.
