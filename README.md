# crowdin-cli-tool [![Supporting](https://github.com/Cado-Labs/cado-labs-logos/blob/main/cado_labs_badge.png)](https://github.com/Cado-Labs/) ![release](https://github.com/Cado-Labs/CrowdinCLI/actions/workflows/release-package.yml/badge.svg)

Crowdin CLI optimized for work with branches

<p>
  <a href="https://github.com/Cado-Labs">
    <img src="https://github.com/Cado-Labs/cado-labs-logos/blob/main/cado_labs_supporting.svg" alt="Supported by Cado Labs" />
  </a>
</p>

---
[![NPM](https://nodei.co/npm/@cadolabs/crowdin-cli.png)](https://www.npmjs.com/package/@cadolabs/crowdin-cli)

* [Requirements](#requirements)
* [CLI description](#cli-description)
  * [Example workflow](#example-workflow)
  * [Installation](#installation)
  * [Setup](#setup)
  * [Commands](#commands)
  * [Params](#params)
  * [Config](#config)
* [Links](#links)
* [Contributing](#contributing)
* [License](#license)
* [Supporting](#supporting)
* [Authors](#authors)

## Requirements

* Node 12+

## CLI description

* source - root language setuped in crowdin
* targetLanguage - all languages setuped in crowdin for project

### Example workflow

1. Add keys and translations in source file
1. Upload only added in new crowdin branch `crowdin push-diff -b new-branch`
1. Wait for translators work
1. Download and merge it `crowdin pull-diff -b new-branch`


### Installation

`npm i @cadolabs/crowdin-cli` or `yarn add @cadolabs/crowdin-cli`

Can be installed global (run as `crowdin`) or in project dependencies (run `npx crowdin` or `yarn crowdin` from project) (Recomended).

> For check installation run `crowdin -v`

### Setup

Write token in `.crowdin` file.

File will be created in command run directory

`crowin init --token <crowdin_token>`

Where `<crowdin_token>` - api token generated in crowdin profile with `access all` checkbox

> Add .crowdin in .gitignore

### commands

`init` - Save token in `.crowdin` file

`lint` - Check translations syntax 

`push-diff` - Upload translations diff (Throw error in master branch)

`pull-diff` - Download translations diff (Throw error in master branch)

`upload-source` - Upload only source file

`upload-translations` - DEPRECATED. Upload only translations (Throw error if source not uploaded).

`upload` or `push` - UDEPRECATED. pload source and then translations (runs `upload-source` and `upload-translations`)

`download` or `pull` - DDEPRECATED. ownload all translations

`task` - Create task in crowdin

`clean` - Remove branch in crowdin

`sync` - DEPRECATED. Upload source, translations, and download all from crowdin

### Params

`-v` or `--version` - Show CLI version

`-h` or `--help` - Show help

`-b` or `--branch` - Crowdin branch

`-c` or `--config` - Path to config file

`-l` or `--languages` - Comma separetd language list (all by default). Ex. `crowdin upload -l "ru, en, fr"`

`--silent` - Show logs line by line, without animations

`--token` - Generated in crowdin api-token

`--organization` - Organization name in crowdin enterprise

`--fix` - Fix errors with `lint` command. ATTENTION! This delete crowdin branch too!

`--diff-with` - With `push` or `push-diff` create diff with coomit/tag/etc.

`--project-id` - Crowdin project ID

`--base-dir` - Look at 'Config'

`--path` - Look at 'Config'

`--use-git-branch-as-default` - Look at 'Config'

`--import-eq-suggestions` - Defines whether to add translation if it's the same as the source string

`--auto-approve-imported` - Mark uploaded translations as approved

`--skip-untranslated-strings` - Defines whether to export only translated strings

`--skip-format-step` - Deprecated. Skip format step after download translations

`--contributors` - Comma separated user id list to assign new tasks

### Config

Some params can be represent in config.

Place file `.crowdin-config.json` in project directory.

`.crowdin-config.json` file contents:

```
{
  "token": string, // api token generated in crowdin profile. Strongly non recommend to place it project config
  "organization": string, // Organization name in crowdin enterprise
  "projectId": string, // Crowdin project ID
  "baseDir": string, // Path to translations/directories to upload in crowdin.
  // Relative to config file or absolute
  // Children directory structure will be saved in crowdin.
  "path": string, // Path to files relative to 'baseDir'
  // Glob syntax allowed
  // File name require on of theese variables: %{id/name/editorCode/twoLettersCode/threeLettersCode/locale/androidCode/osxLocale}!
  // Example: './config/**/locale_prefex.%{twoLettersCode}.yml'
  // For files 'config/dir1/locale_prefex.en.yml' and 'config/dir1/locale_prefex.ru.yml'
  "useGitBranchAsDefault": boolean, // Use git branch by default
  // Blocks uploading to master branch
  // Ignored with param '-b' or '--branch
  "importEqSuggestions": boolean, // Defines whether to add translation if it's the same as the source string
  "autoApproveImported": boolean, // Mark uploaded translations as approved
  "skipUntranslatedStrings": boolean, // Defines whether to export only translated strings
  "contributors": string[], // Comma separated user id list to assign new tasks
  "translateHidden": boolean, // Allow translations upload to hidden source strings
  "skipAssignedStrings": boolean, // Skip strings already included in other tasks
  "exportWithMinApprovalsCount": number, // Defines whether to export only approved strings
  "skipFormatStep": boolean, // Deprecated. Skip format step after download translations
}
```

## Links

* [Crowdin api](https://support.crowdin.com/enterprise/api/)

## Contributing

[Contributing Rules](https://github.com/umbrellio/guidelines/blob/master/CONTRIBUTING.md) | [Code of Conduct](https://github.com/umbrellio/guidelines/blob/master/CODE_OF_CONDUCT.md)

## License

Released under MIT License.

## Supporting

<a href="https://github.com/Cado-Labs">
  <img src="https://github.com/Cado-Labs/cado-labs-logos/blob/main/cado_labs_logo.png" alt="Supported by Cado Labs" />
</a>

## Authors

[Jenya Gul](https://github.com/guljeny)
