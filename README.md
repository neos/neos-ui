# @PackageFactory/PackageFactory.Guevara
[![Build Status](https://travis-ci.org/PackageFactory/PackageFactory.Guevara.svg?branch=master)](https://travis-ci.org/PackageFactory/PackageFactory.Guevara) [![Dependency Status](https://david-dm.org/PackageFactory/PackageFactory.Guevara.svg)](https://david-dm.org/PackageFactory/PackageFactory.Guevara) [![devDependency Status](https://david-dm.org/PackageFactory/PackageFactory.Guevara/dev-status.svg)](https://david-dm.org/PackageFactory/PackageFactory.Guevara#info=devDependencies&view=table)
[![Code Climate](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara/badges/gpa.svg)](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara)
[![Test Coverage](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara/badges/coverage.svg)](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara/coverage) [![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/inkdpixels.svg)](https://saucelabs.com/u/inkdpixels)

> The next generation Neos CMS interface written in ReactJS with Immutable data structures.


## Features
* Better editing experience for responsive websites.
* Faster load times for the backend.
* No reload constraint for the correct stylesheets on multi-site systems.
* Updated Font-Awesome to v4.5.0 (old icon names are migrated on the fly).


## Installation
*Full composer support coming soon...*

1. Since our package currently conflicts with the default FrontendLogin package, we need to
   remove it.  
   **Remove the following line** from your `composer.json` file:  
   ```
   "flowpack/neos-frontendlogin": "@dev"
   ```

2. Add the following lines to your `composer.json` (our package is not published to composer
   repository yet, so we need to give composer hints where to find it):
   ```
    "repositories": [
        { "type": "vcs", "url": "https://github.com/PackageFactory/PackageFactory.Guevara.git" }
    ],
   ```
   Note: if you plan to contribute to the project, fork it and provide VCS url to your forked repository.

3. Run the following commands:  
   ```
   rm -rf Packages/Plugins/Flowpack.Neos.FrontendLogin # remove the conflicting FrontendLogin
   rm -rf Data/Temporary/* Configuration/PackageStates.php # clear the caches
   composer require packagefactory/guevara:dev-master # install our package
   cd Packages/Application/PackageFactory.Guevara
   source Build/init.sh # do NodeJS stuff ie. install required node version using nvm, install npm deps
   npm run build # build everything using webpack (you might see some webpack warnings, but you can ignore them)
   ```

4. Paste the following configuration into the **head** of your global `Routes.yaml` which is located in `Configuration/`  
   ```yaml
-
  name: 'PackageFactory Guevara'
  uriPattern: '<GuevaraSubroutes>'
  subRoutes:
    'GuevaraSubroutes':
      package: 'PackageFactory.Guevara'
   ```

Now you are all set up and can open the sub-route `/che!` to login to the new interface.

__Note: We require [nvm](https://github.com/creationix/nvm#install-script) as well as the `npm` command to be installed on your system.
If you've installed `nvm` make sure that the node LTS version `4.2.2` is correctly installed - You can do so by executing `nvm install v4.2.2`.
If you need help setting up `nvm`, `npm` or if you got any other problems, join our [Slack](https://neos-project.slack.com/) channel and we are most happy to help you with it. :).__


## Contributing

[Read developer documentation on our wiki](https://github.com/PackageFactory/PackageFactory.Guevara/wiki).

#### Development commands
| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run build` | Builds all assets via webpack. |
| `npm run lint:scripts`  | Lints all `.js` files via ESLint. |
| `npm run lint:css`  | Lints all `.css` files via StyleLint. |
| `npm run lint`  | Runs the above stated watch commands sequentially. |
| `npm run karma` | Executes a single run of all unit tests via karma. (This is pretty slow due to webpack's single-compilation speed, use the `watch:karma` task instead for development) |
| `npm run selenium:init` | Installs and boots the selenium server. See [Writing integration tests](#integration-tests) for more info. |
| `npm run selenium:run` | Executes all integration tests via WebdriverIO. See [Writing integration tests](#integration-tests) for more info. |
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

#### <a name="integration-tests"></a> Writing integration tests
The integration tests are running on a selenium grid which is installed & started by the `npm run selenium:init` command,
and executed by [WebdriverIO](http://webdriver.io/). Assertions are written with [chai](http://chaijs.com/).
To run the integration tests, execute `npm run selenium:init` first, and `npm run selenium:run` in a separate session afterwards.

Adding user stories is as simple as creating unit tests, the only difference is that the file needs to be placed in the `Tests` root directory and should end with `*.story.js` instead of `*.spec.js`.

Since acceptance testing can be relatively time-intensive, it’s important to plan how to organize your tests. It is possible to organize your tests by creating multiple configuration files: each file can define a different list of “specs” directories.
Additionally, Mocha’s “grep” option is exposed to the --mochaOpts option, so you can use it to perform pattern matching on your test descriptions:

    npm run selenium:run -- --mochaOpts.grep "should persist the changes"

#### Libraries which are used by the application
| Name          | Description/Usecase          |
| ------------- | ---------------------------- |
| [immutable](https://facebook.github.io/immutable-js/) | Transforms data into immutable structures. [Read more](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript) |
| [redux](https://github.com/rackt/redux) | Handles the state of the application in general. [Read more](http://www.jchapron.com/2015/08/14/getting-started-with-redux/) |
| [react](https://facebook.github.io/react/) | The view layer on which the UI is based upon. |
| [react-motion](https://github.com/chenglou/react-motion) / [react-motion-ui-pack](https://github.com/souporserious/react-motion-ui-pack) | Simple animations in react. |
| [@reduct/component](https://github.com/reduct/component) | Used for low-level components which interact directly with server side rendered markup. |


## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
