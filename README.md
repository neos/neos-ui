# @PackageFactory/PackageFactory.Guevara
[![Build Status](https://travis-ci.org/PackageFactory/PackageFactory.Guevara.svg)](https://travis-ci.org/PackageFactory/PackageFactory.Guevara) [![Dependency Status](https://david-dm.org/PackageFactory/PackageFactory.Guevara.svg)](https://david-dm.org/PackageFactory/PackageFactory.Guevara) [![devDependency Status](https://david-dm.org/PackageFactory/PackageFactory.Guevara/dev-status.svg)](https://david-dm.org/PackageFactory/PackageFactory.Guevara#info=devDependencies&view=table)

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
__Note: We recommend the node version `4.2.2` as well as the npm version `2.14.7`.__

Done. Open the sub-route `/che!` to login to the new interface.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
