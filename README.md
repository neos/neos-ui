# @neos/neos-ui
[![CircleCI](https://circleci.com/gh/neos/neos-ui.svg?style=svg)](https://circleci.com/gh/neos/neos-ui) [![Dependency Status](https://david-dm.org/neos/neos-ui.svg)](https://david-dm.org/neos/neos-ui) [![Known Vulnerabilities](https://snyk.io/test/github/neos/neos-ui/badge.svg?targetFile=package.json)](https://snyk.io/test/github/neos/neos-ui?targetFile=package.json)
[![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

> The next generation Neos CMS interface written in ReactJS and a ton of other fun technology.

## Versioning

This repository follows the same versioning scheme as Neos itself, with the only exception that the 4.0 branch works with all Neos 4.x releases.
Release roadmap is [available here](https://www.neos.io/features/release-process.html)

That means:
* All bugfixes go to the lowest maintained branch
* All new features go only to master
* New minor and major releases are made in sync with Neos/Flow. Bugfix releases may be available independantly

### Currently maintained versions

* NeosCMS version 4.x: branch 4.0
* NeosCMS version 5.0: branch 5.0
* NeosCMS version 5.1: branch 5.1
* NeosCMS version 5.2: branch 5.2
* NeosCMS version 5.3: branch 5.3
* NeosCMS version 7.0: branch 7.0
* latest development happens in master

## Browser support

The new interface supports all evergreen (i.e. self-updating) browsers, including: **Chrome, Firefox, Safari, Edge, Opera and other webkit-based browsers**.

In order to get **IE11** to work, please switch to CKEditor 4, as CKEditor 5 doesn't support it. But doing so is highly discouraged, so where possibly encourage your editors to use modern browsers.

If you discover bugs in any of the supported browsers, please [report them](https://github.com/neos/neos-ui/issues/new)!

## Features

* Better editing experience for responsive websites.
* Faster load times for the backend.
* No reload constraint for the correct stylesheets on multi-site systems.
* Updated Font-Awesome to v5.0 (old icon names are migrated on the fly).


## Installation and usage

The new UI is [already included](https://github.com/neos/neos-base-distribution/blob/3.3/composer.json#L24) in the base Neos distribution. If you don't have it installed yet, follow these steps:

1. You need to have Neos CMS 3.3 or newer up & running.

2. Run the following command:

```
composer require neos/neos-ui
```

3. Now you are all set up and you can login to the new interface as usual via `/neos` route.

### Updating

```
composer update neos/neos-ui
```

### Installing dev-master

For trying out the new UI, we recommend you to run the regularily released beta releases.
However, if you want to stay on bleeding-edge, or want to help out developing, you'll
need the `dev-master` release. You can install the master release using:

```
composer require neos/neos-ui-compiled:dev-master neos/neos-ui:dev-master
```

## Contributing

Please follow the respective guides for contributing on OSX and on Linux.

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
git checkout 5.0 && git fetch && git reset --hard origin/5.0 && git merge --no-ff --no-commit origin/4.0
# review and `git commit`
git checkout 5.1 && git fetch && git reset --hard origin/5.1 && git merge --no-ff --no-commit origin/5.0
# review and `git commit`
git checkout 5.2 && git fetch && git reset --hard origin/5.2 && git merge --no-ff --no-commit origin/5.1
# review and `git commit`
git checkout 5.3 && git fetch && git reset --hard origin/5.3 && git merge --no-ff --no-commit origin/5.2
# review and `git commit`
git checkout 7.0 && git fetch && git reset --hard origin/7.0 && git merge --no-ff --no-commit origin/5.3
# review and `git commit`
git checkout master && git fetch && git reset --hard origin/master && git merge --no-ff --no-commit origin/7.0
# review and `git commit`
```

#### Development commands
| Command         | Description                    |
| --------------- | ------------------------------ |
| `make clean` | delete all node_modules in every subdirectory. |
| `make build` |  Runs the development build. |
| `make build-watch` | Watches the source files for changes and runs a build in case. |
| `make build-watch-poll` | Watches (and polls) the source files on a file share. Should preferably be used when working an a VM for example. |
| `make storybook` | Starts the storybook server on port 9001. |
| `make lint`  | Executes `make lint-js` and `make lint-editorconfig`. |
| `make lint-js`  | Runs test in all subpackages via lerna. |
| `make lint-editorconfig`  | Tests if all files respect the `.editorconfig`. |
| `make test`  | Executes the test on all source files. |
| `make test-e2e`  | Executes integration tests. |

##### Custom webpack live reload options

If you are developing inside a virtual machine and you are running the
watch command on your local system it is may be needed for you to adjust
the live reload optons.

This can be done by putting an `.webpack.livereload.local.js` inside the
repository root.

An example file would look like this:

```javascript
module.exports = {
    protocol: 'http',
    port: '123',
    hostname: 'localhost'
};
```

#### Writing unit tests
The unit tests are executed with [jest](https://facebook.github.io/jest/).
To run the unit tests, execute `make test` in your shell.

Adding unit tests is fairly simple, just create a file on the same tree level as your changed/new feature, named `[filename].spec.js` and karma will execute all tests found within the spec file, other than that, just orient yourself on the existing tests.

Use `it.only(() => {})` and `describe.only(() => {})` if you want to run a specific test and not the whole test suite.

#### Integration tests

To setup end-to-end tests locally you have got to do the same things described in [CircleCI workflow](https://github.com/neos/neos-ui/blob/master/.circleci/config.yml), namely take the [test disribution](https://github.com/neos/neos-ui/blob/master/Tests/IntegrationTests/TestDistribution/composer.json) and `composer install` in it, put the right branch into Neos.Neos.Ui folder and run webserver and mysql server with the same config as described in the test distribution's [Settings.yaml](https://github.com/neos/neos-ui/blob/master/Tests/IntegrationTests/TestDistribution/Configuration/Settings.yaml) (or adjust it).

For executing the end to end tests on a Mac with catalina or higher you need to permit screen recording. Open 'System Preferences > Security & Privacy > Privacy > Screen Recording' and check 'TestCafe Browser Tools' in the application list.

##### Debugging integration tests

* View the recording via Sauce Labs. You can find the url in the beginning of the test output.
* Observe Flow exceptions and logs in build artifacts.
* You can trigger a SSH enabled build via the CircleCI interface and then login.

#### Releasing

You only need to trigger the jenkins release with the version you want to release.
After jenkins has finished you need release a new version on github.

## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
