# @PackageFactory/PackageFactory.Guevara
[![Build Status](https://travis-ci.org/PackageFactory/PackageFactory.Guevara.svg)](https://travis-ci.org/PackageFactory.Guevara) [![Dependency Status](https://david-dm.org/PackageFactory.Guevara.svg)](https://david-dm.org/PackageFactory.Guevara) [![devDependency Status](https://david-dm.org/PackageFactory.Guevara/dev-status.svg)](https://david-dm.org/PackageFactory.Guevara#info=devDependencies)

> A prototype for the [Neos CMS](https://www.neos.io/) written in ReactJS with Immutable data structures.

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
