# @neos/neos-ui
[![Build Status](https://travis-ci.org/neos/neos-ui.svg?branch=master)](https://travis-ci.org/neos/neos-ui) [![Dependency Status](https://david-dm.org/neos/neos-ui.svg)](https://david-dm.org/neos/neos-ui) [![devDependency Status](https://david-dm.org/neos/neos-ui/dev-status.svg)](https://david-dm.org/neos/neos-ui#info=devDependencies&view=table)
[![Code Climate](https://codeclimate.com/github/neos/neos-ui/badges/gpa.svg)](https://codeclimate.com/github/neos/neos-ui)
[![Test Coverage](https://codeclimate.com/github/neos/neos-ui/badges/coverage.svg)](https://codeclimate.com/github/neos/neos-ui/coverage)
[![Stories in Ready](https://badge.waffle.io/neos/neos-ui.svg?label=ready&title=Issues+Ready)](http://waffle.io/neos/neos-ui)
[![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

> The next generation Neos CMS interface written in ReactJS with Immutable data structures.


## Features

* Better editing experience for responsive websites.
* Faster load times for the backend.
* No reload constraint for the correct stylesheets on multi-site systems.
* Updated Font-Awesome to v4.5.0 (old icon names are migrated on the fly).


## Installation and usage

1. You need to have latest Neos CMS up & running.

You can use this composer.json for that.
   ```
   {
    "name": "neos/neos-development-distribution",
    "description" : "Neos Development Distribution",
    "license": "GPL-3.0+",
    "support": {
        "email": "hello@neos.io",
        "slack": "http://slack.neos.io/",
        "forum": "https://discuss.neos.io/",
        "wiki": "https://discuss.neos.io/c/the-neos-project/project-documentation",
        "issues": "https://jira.neos.io/browse/NEOS",
        "docs": "http://neos.readthedocs.io/",
        "source": "https://github.com/neos/neos-development-distribution"
    },
    "config": {
        "vendor-dir": "Packages/Libraries",
        "bin-dir": "bin"
    },
    "require": {
        "neos/neos-development-collection": "dev-master",
        "neos/flow-development-collection": "dev-master",
        "neos/demo": "dev-master",

        "typo3/party": "dev-master",
        "typo3/neos-seo": "dev-master",
        "typo3/imagine": "dev-master",
        "typo3/twitter-bootstrap": "dev-master",
        "typo3/form": "dev-master",
        "typo3/setup": "dev-master",
        "flowpack/neos-frontendlogin": "dev-master",
        "typo3/buildessentials": "dev-master",
        "mikey179/vfsstream": "~1.6",
        "phpunit/phpunit": "~4.8 || ~5.4.0",
        "symfony/css-selector": "~2.0",
        "flowpack/behat": "dev-master",
        "neos/neos-ui": "dev-master"
    },
    "suggest": {
        "ext-pdo_sqlite": "For running functional tests out-of-the-box this is required"
    },
    "scripts": {
        "post-update-cmd": "TYPO3\\Flow\\Composer\\InstallerScripts::postUpdateAndInstall",
        "post-install-cmd": "TYPO3\\Flow\\Composer\\InstallerScripts::postUpdateAndInstall",
        "post-package-update": "TYPO3\\Flow\\Composer\\InstallerScripts::postPackageUpdateAndInstall",
        "post-package-install": "TYPO3\\Flow\\Composer\\InstallerScripts::postPackageUpdateAndInstall"
    }
}

   ```


2. Run the following commands:
   ```
   composer require neos/neos-ui:dev-master # install our package (you only need this, if you are NOT using the composer.json from above)
   ```

3. Paste the following configuration into the **head** of your global `Routes.yaml` which is located in `Configuration/`
   ```yaml
  -
    name: 'Neos UI'
    uriPattern: '<NeosUiSubroutes>'
    subRoutes:
      'NeosUiSubroutes':
        package: 'Neos.Neos.Ui'
   ```

Now you are all set up and can open the sub-route `/neos!` to login to the new interface.


### Use Docker image

__Alternatively__, instead of doing above setup steps manually, use Docker.
The [million12/neos-react-ui](https://github.com/million12/docker-neos-react-ui)
contains Neos CMS, correct version of NodeJS/nvm and `neos/neos-ui` package
installed and built, working out of the box.

Refer to [million12/neos-react-ui](https://github.com/million12/docker-neos-react-ui)
documentation about how to use it.


## Contributing

In order to start contributing, follow the following steps:

1) We require [nvm](https://github.com/creationix/nvm#install-script) as well as the `npm` command to be installed on your system.

   If you've installed `nvm` make sure that the next node LTS version `6.3.0` is correctly installed - You can do so by executing `nvm install v6.3.0`.
   If you need help setting up `nvm`, `npm` or if you got any other problems, join our [Slack](https://neos-project.slack.com/) channel and we are most happy to help you with it. :).__

2) Inside `Configuration/Settings.yaml`, set the following property for disabling the pre-compiled files:

   ```
   Neos:
     Neos:
       Ui:
         frontendDevelopmentMode: true
   ```

2) Run the initialization script:

   ```
   cd Packages/Application/Neos.Neos.Ui
   source Build/init.sh # do NodeJS stuff ie. install required node version using nvm, install npm deps, copy githooks
   npm run build # build everything using webpack (you might see some webpack warnings, but you can ignore them)
   ```

[Read developer documentation on our wiki](https://github.com/neos/neos-ui/wiki).

#### Development commands
| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run clear` | delete all node_modules in every subdirectory. |
| `npm run build:ui`  | Builds the ui via webpack. |
| `npm run build:components` | Builds the components. |
| `npm run build` |  Runs the both build commands above sequentially. |
| `npm run build:ui:watch` | Watches the source files for changes and runs a build:ui in case. |
| `npm run build:components:watch` | Watches the source files for changes and runs a build:components in case. |
| `npm run build:components:watch` | Watches the source files for changes and runs a build:components in case. |
| `npm start-storybook` | Starts the storybook server. |
| `npm run lint`  | Lints all source files. |
| `npm run test`  | Executes `npm run lint` to trigger tests via ava. |

#### Code style
Our code style is based upon `xo`, with one big difference - We use 4 spaces instead of tabs, to align our code style a bit with the PSR-2 standard for our PHP codebase. To lint the code, execute `npm run lint` in your shell.

#### Writing unit tests
The unit tests are executed with [ava](https://github.com/avajs/ava).
To run the unit tests, execute `npm run test` in your shell.

Adding unit tests is fairly simple, just create a file on the same tree level as your changed/new feature, named `[filename].spec.js` and karma will execute all tests found within the spec file, other than that, just orient yourself on the existing tests.

Use `it.only(() => {})` and `describe.only(() => {})` if you want to run a specific test and not the whole test suite.

## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
