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

2. Run the following commands:
   ```
   composer require neos/neos-ui:dev-master # install our package
   cd Packages/Application/Neos.Neos.Ui
   source Build/init.sh # do NodeJS stuff ie. install required node version using nvm, install npm deps
   npm run build # build everything using webpack (you might see some webpack warnings, but you can ignore them)
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

__Note: We require [nvm](https://github.com/creationix/nvm#install-script) as well as the `npm` command to be installed on your system.
If you've installed `nvm` make sure that the next node LTS version `6.3.0` is correctly installed - You can do so by executing `nvm install v6.3.0`.
If you need help setting up `nvm`, `npm` or if you got any other problems, join our [Slack](https://neos-project.slack.com/) channel and we are most happy to help you with it. :).__


### Use Docker image

__Alternatively__, instead of doing above setup steps manually, use Docker.
The [million12/neos-react-ui](https://github.com/million12/docker-neos-react-ui)
contains Neos CMS, correct version of NodeJS/nvm and `neos/neos-ui` package
installed and built, working out of the box.

Refer to [million12/neos-react-ui](https://github.com/million12/docker-neos-react-ui)
documentation about how to use it.


## Contributing

[Read developer documentation on our wiki](https://github.com/neos/neos-ui/wiki).

#### Development commands
| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run build` | Builds all assets via webpack. |
| `npm run lint:scripts`  | Lints all `.js` files via ESLint. |
| `npm run lint:css`  | Lints all `.css` files via StyleLint. |
| `npm run lint`  | Runs the above stated watch commands sequentially. |
| `npm run karma` | Executes a single run of all unit tests via karma. (This is pretty slow due to webpack's single-compilation speed, use the `watch:karma` task instead for development) |
| `npm run watch:build`  | Watches all source files and rebuilds the compiled files on file changes. |
| `npm run watch:karma`  | Watches all source files and unit test specs and runs karma after the compilation has been completed. |
| `npm run watch`  | Runs the above stated watch commands sequentially. |
| `npm test`  | Executes both `npm run lint` and `npm run karma` sequentially. |

#### Code style
Our code style is based upon `xo`, with one big difference - We use 4 spaces instead of tabs, to align our code style a bit with the PSR-2 standard for our PHP codebase. To lint the code, execute `npm run lint` in your shell.

#### Writing unit tests
The unit tests are executed with Karma and PhantomJS.
Instead of relying on the default settings of Karma, we use [chai](http://chaijs.com/) as our assertion library and
[sinon](http://sinonjs.org/) for spies. To run the unit tests, execute `npm run karma` in your shell.

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
