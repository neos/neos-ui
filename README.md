# @PackageFactory/PackageFactory.Guevara
[![Build Status](https://travis-ci.org/PackageFactory/PackageFactory.Guevara.svg)](https://travis-ci.org/PackageFactory/PackageFactory.Guevara) [![Dependency Status](https://david-dm.org/PackageFactory/PackageFactory.Guevara.svg)](https://david-dm.org/PackageFactory/PackageFactory.Guevara) [![devDependency Status](https://david-dm.org/PackageFactory/PackageFactory.Guevara/dev-status.svg)](https://david-dm.org/PackageFactory/PackageFactory.Guevara#info=devDependencies&view=table)
[![Code Climate](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara/badges/gpa.svg)](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara)
[![Test Coverage](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara/badges/coverage.svg)](https://codeclimate.com/github/PackageFactory/PackageFactory.Guevara/coverage)

> A prototype for the [Neos CMS](https://www.neos.io/) written in ReactJS with Immutable data structures.


## Features
* Better editing experience for responsive websites.
* Faster load times for the backend.
* No reload constraint for the correct stylesheets on multi-site systems.
* Updated Font-Awesome to v4.5.0 (old icon names are migrated on the fly).


## Installation
*Composer support coming soon...*

Clone the repository into your Neos `Packages/Application/` folder, delete the default flowpack Neos login package from the `Packages/Plugins` directory
and paste the following configuration into the head of your global `Routes.yaml` which is located in `Configuration/`.
```yaml
-
  name: 'PackageFactory Guevara'
  uriPattern: '<GuevaraSubroutes>'
  subRoutes:
    'GuevaraSubroutes':
      package: 'PackageFactory.Guevara'
```

Change into the directory of the Guevara package, execute `npm install` as well as `npm run build` to build the JS compiled files.


Done. Open the sub-route `/che!` to login to the new interface.


## Contributing
### Setup
After installing the package into your Flow application, execute
```
bash Build/init.sh
```

which will install all dependencies and creates the initial bundle for the application.

__Note: We require [nvm](https://github.com/creationix/nvm#install-script) as well as the `npm` command to be installed on your system.
If you've installed `nvm` make sure that the node LTS version `4.2.2` is correctly installed - You can do so by executing `nvm install 4.2.2`.
If you need help setting up `nvm` or `npm`, join our [Slack](https://neos-project.slack.com/) channel :).__


### Writing tests
By default, our tests are executed with Karma and PhantomJS.
Instead of relying on the default settings of Karma, we use [chai]('http://chaijs.com/') as our assertion library and
[sinon](http://sinonjs.org/) for spies.

### Libraries
| Name | Description/Usecase          |
| ------------- | ----------- |
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
