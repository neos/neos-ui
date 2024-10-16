# @neos/neos-ui
[![CircleCI](https://circleci.com/gh/neos/neos-ui.svg?style=svg)](https://circleci.com/gh/neos/neos-ui) [![Known Vulnerabilities](https://snyk.io/test/github/neos/neos-ui/badge.svg?targetFile=package.json)](https://snyk.io/test/github/neos/neos-ui?targetFile=package.json)
[![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

> The Neos CMS interface written in ReactJS and a ton of other fun technology.

## Versioning

This repository follows the same versioning scheme as Neos itself.
Release roadmap is [available here](https://www.neos.io/features/release-process.html)

That means:
* All bugfixes go to the lowest maintained branch
* All new features go only to the 8.4 and 9.0 branch
* New minor and major releases are made in sync with Neos/Flow. Bugfix releases may be available independently


### Currently maintained versions

* NeosCMS version 8.3: branch 8.3
* NeosCMS version 8.3: branch 8.4
* NeosCMS version 9.0: branch 9.0
* latest development happens currently in the 8.4 and 9.0 branch

#### Releases with just security updates

* NeosCMS version 7.3: branch 7.3
* NeosCMS version 8.0: branch 8.0
* NeosCMS version 8.1: branch 8.1
* NeosCMS version 8.2: branch 8.2

## Browser support

The new interface supports all evergreen (i.e. self-updating) browsers, including: **Chrome, Firefox, Safari, Edge, Opera and other webkit-based browsers**.

If you discover bugs in any of the supported browsers, please [report them](https://github.com/neos/neos-ui/issues/new)!

## Features

* Blazingly fast Yarn 3 + ESbuild stack
* https://www.neos.io/features/editing-content.html
* https://www.neos.io/features/inline-editing-true-wysiwyg.html

## Installation and usage

The UI is [already included](https://github.com/neos/neos-base-distribution/blob/3.3/composer.json#L24) in the base Neos distribution.
And on Packagist available via: `neos/neos-ui`


### Updating

```bash
composer update neos/neos-ui
```

### Installing latest development

For trying out the new UI, we recommend you to run the regularly  released beta releases.
However, if you want to stay on bleeding-edge, or want to help out developing, you'll
need the `9.0.x-dev` release. You can install the latest release using:


```bash
composer require neos/neos-ui-compiled:9.0.x-dev neos/neos-ui:9.0.x-dev
```

## Contributing

Please follow the respective guides for contributing on OSX and on Linux.

To start developing the Neos Ui you will need a running Neos instance locally.
You can use 
* one of your own, local Neos 8.3 instances,
* create a new one with `composer create-project neos/neos-base-distribution neos-ui-development-instance`,
* or use the docker compose setup in this repository (see instructions below).

### Setup Source Files and Git
To install the source files and setup git, run:

```bash
composer require neos/neos-ui-compiled:8.4.x-dev neos/neos-ui:8.4.x-dev --prefer-source
```

This will sync the git repository of Neos Ui into `Packages/Application/Neos.Neos.Ui` (this might take a while).
To push your changes to GitHub you need to fork the Neos Ui and change the git remote to your fork (check with `git remove -v`).

Run `make setup`. To check what commands are executed have a look at the `Makefile` in the root of this repository.

### on Windows

1) Ensure you have the relevant version installed (see above).

2) Please install Docker for Windows.

3) Run `docker-compose up`.

4) Inside `Configuration/Settings.yaml`, set the following property for disabling the pre-compiled files:

```yaml
Neos:
  Neos:
    Ui:
      frontendDevelopmentMode: true
```

6) Get an overview about the codebase. We've recorded [an introduction on YouTube](https://www.youtube.com/watch?v=RYBUS5Nxxxk) which gets you acquainted with the basics. Additionally, please get in touch with us on [Slack](http://slack.neos.io) in the channel #project-ui-rewrite. We're eager to help you get started!

### on OSX / Linux

In order to start contributing on OSX / Linux, follow the following steps:

1) Ensure you have the relevant version installed (see above).

2) We require [Chrome](https://www.google.com/chrome/browser/desktop/index.html) as well as the `yarn`(https://yarnpkg.com/en/) command and GNU Make(https://www.gnu.org/software/make/) to be installed on your system.

3) The currently supported version of `node` is defined in `.nvmrc` file. If you have [nvm](https://github.com/creationix/nvm) installed, you can just run `nvm install && nvm use` from the project directory.

4) Inside `Configuration/Settings.yaml`, set the following property for disabling the pre-compiled files:

```yaml
Neos:
  Neos:
    Ui:
      frontendDevelopmentMode: true
```

5) Run the initialization script:

```
make setup
```

6) Get an overview about the codebase. We've recorded [an introduction on YouTube](https://www.youtube.com/watch?v=RYBUS5Nxxxk) which gets you acquainted with the basics. Additionally, please get in touch with us on [Slack](http://slack.neos.io) in the channel #project-ui-rewrite. We're eager to help you get started!

#### Guideline for PR and commit messages

Please see [our guideline](https://neos.readthedocs.io/en/latest/Contribute/Documentation/BeginnersGuide.html#guideline-commit-messages)
on how to write meaningful descriptions for your contributions.

#### Doing upmerges

To do the upmerge run the following commands

```
# review and `git commit`
git checkout 8.0 && git fetch && git reset --hard origin/8.0 && git merge --no-ff --no-commit origin/7.3
# review and `git commit`
git checkout 8.1 && git fetch && git reset --hard origin/8.1 && git merge --no-ff --no-commit origin/8.0
# review and `git commit`
git checkout 8.2 && git fetch && git reset --hard origin/8.2 && git merge --no-ff --no-commit origin/8.1
# review and `git commit`
git checkout 8.3 && git fetch && git reset --hard origin/8.3 && git merge --no-ff --no-commit origin/8.2
# review and `git commit`
git checkout 8.4 && git fetch && git reset --hard origin/8.4 && git merge --no-ff --no-commit origin/8.3
# review and `git commit`
git checkout 9.0 && git fetch && git reset --hard origin/9.0 && git merge --no-ff --no-commit origin/8.4
# review and `git commit`
```

#### Development commands
| Command         | Description                   |
| --------------- | ----------------------------- |
| `make clean` | delete all node_modules in every subdirectory. |
| `make build` |  Runs the development build. |
| `make build-watch` | Watches the source files for changes and runs a build in case. |
| `make lint`  | Executes `make lint-js` and `make lint-editorconfig`. |
| `make lint-js`  | Runs test in all subpackages. |
| `make lint-editorconfig`  | Tests if all files respect the `.editorconfig`. |
| `make test`  | Executes the test on all source files. |
| `make test-e2e`  | Executes integration tests. |

#### Writing unit tests
The unit tests are executed with [jest](https://facebook.github.io/jest/).
To run the unit tests, execute `make test` in your shell.

Adding unit tests is fairly simple, just create a file on the same tree level as your changed/new feature, named `[filename].spec.js` and karma will execute all tests found within the spec file, other than that, just orient yourself on the existing tests.

Use `it.only(() => {})` and `describe.only(() => {})` if you want to run a specific test and not the whole test suite.

#### Integration tests

To setup end-to-end tests locally you have got to do the same things described in [CircleCI workflow](https://github.com/neos/neos-ui/blob/8.3/.circleci/config.yml), namely take the [test disribution](https://github.com/neos/neos-ui/blob/8.3/Tests/IntegrationTests/TestDistribution/composer.json) and `composer install` in it, put the right branch into Neos.Neos.Ui folder and run webserver and mysql server with the same config as described in the test distribution's [Settings.yaml](https://github.com/neos/neos-ui/blob/8.3/Tests/IntegrationTests/TestDistribution/Configuration/Settings.yaml) (or adjust it).

For executing the end to end tests on a Mac with catalina or higher you need to permit screen recording. Open 'System Preferences > Security & Privacy > Privacy > Screen Recording' and check 'TestCafe Browser Tools' in the application list.

```bash
make test-e2e-docker
```

#### Local Development with e2e-tests & docker

To speed up the e2e-test workflow/feedback loop you can start the system under test in a docker setup and run the tests against that:
* `make start-neos-dev-instance` (starts a docker setup with the system under test and keep it running - in the `1Dimension` scenario)
* The neos dev instance is available at `localhost:8081`
* To enter the container run `docker compose -f Tests/IntegrationTests/docker-compose.neos-dev-instance.yaml exec php bash`
* `yarn run testcafe <browser> <testFile> <optional flags>`
  * for example, this runs all tests in chrome: (NOTE starting with Chrome 127, --disable-search-engine-choice-screen is needed until https://github.com/DevExpress/testcafe/pull/8248 is released)
  `yarn run testcafe chrome:--disable-search-engine-choice-screen Tests/IntegrationTests/Fixtures/1Dimension`
  * some helpful optional flags are
    * `-T 'sidebars'` - grep tests by pattern and only execute those
    * `--selector-timeout=10000` - if you work on async pieces of the UI then this might help to prevent race conditions 
    * `--assertion-timeout=30000` - see above
    * `--debug-on-fail` - you can debug the state of the app at the moment an assertion failed

##### Debugging integration tests

* View the recording via Sauce Labs. You can find the url in the beginning of the test output.
* Observe Flow exceptions and logs in build artifacts.
* You can trigger a SSH enabled build via the CircleCI interface and then login.

#### Releasing

You only need to trigger the jenkins release with the version you want to release.
After jenkins has finished you need release a new version on github.

## License

see [LICENSE](./LICENSE)
