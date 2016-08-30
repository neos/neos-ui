# @neos-project/react-ui-components
[![Build Status](https://travis-ci.org/neos/react-ui-components.svg?branch=master)](https://travis-ci.org/neos/react-ui-components) [![Dependency Status](https://david-dm.org/neos/react-ui-components.svg)](https://david-dm.org/neos/react-ui-components) [![peerDependencies Status](https://david-dm.org/neos/react-ui-components/peer-status.svg)](https://david-dm.org/neos/react-ui-components?type=peer) [![devDependency Status](https://david-dm.org/neos/react-ui-components/dev-status.svg)](https://david-dm.org/neos/react-ui-components#info=devDependencies&view=table) [![Code Climate](https://codeclimate.com/github/neos/react-ui-components/badges/gpa.svg)](https://codeclimate.com/github/neos/react-ui-components) [![Test Coverage](https://codeclimate.com/github/neos/react-ui-components/badges/coverage.svg)](https://codeclimate.com/github/neos/react-ui-components/coverage)
[![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

> The UI components which power the Neos backend application.

## Dependencies
This package requires some peerDependencies which you need to install after installing this package, see the [package.json](https://github.com/neos/react-ui-components/blob/master/package.json#L98).

## Installation
```
npm i -S @neos-project/react-ui-components
```

## Usage (general)
To reduce the bundled size of applications, we enforce singular import statements of components.
You can import components by pointing to the `lib/` folder, f.e.
```js
import Button from '@neos-project/react-ui-components/lib/Button/';
```

## Usage WITH CSS modules
Within the `index.js` file of each component, CSS gets imported and injected as a `theme` prop.
Your build-tool (f.e. webpack) may can handle this, but we require some additional PostCSS-plugins to be configured.
In case you don't want this, scroll down to the section below, otherwise go on! :-)

An example webpack setup can be found in `.storybook/webpack.config.js`. You can see that we require at least a
CSS modules compliant loader for `*.css` files, as well as the `postcss-css-variables`, `postcss-nested` and `postcss-hexrgba`
PostCSS-plugins to be properly configured.

In case you have problems with your webpack setup, please attach it within the issue you may want to create.

## Usage WITHOUT CSS modules
You can also use the components without any styles provided by this package, but bear in mind that each component
requires a `theme` prop with the `classNames` you need to provide.

In case you want to use the components purely, adjust the import statement to point to the react component only e.g.
```js
import Button from '@neos-project/react-ui-components/lib/Button/button.js';
```

## Theming
All components can be themed using the [react-css-themr](https://github.com/javivelasco/react-css-themr) package,
visit their docs for more information about how this approach works. Our identifiers can be imported e.g.
```js
import identifiers from '@neos-project/react-ui-components/lib/identifiers.js';
```

## Contributing
#### Requirements
* Node in version `^6.3.3`
* NPM in version `^3.10.3`

#### Setup
Clone this repository, execute `nvm use` and afterwards `npm install` in the root directory of the project.
After the installation succeeded, execute `npm start` to start the
[development server of the styleguide](http://localhost:9001).


#### Setup for developing inside the Neos.Neos.Ui Package

[Neos.Neos.Ui](https://github.com/neos/neos-ui)

Make a symbolic link inside your Neos installation to your cloned sources od this package. The following example assumes that both installations are in the same folder.

```
 cd YourNeosUiInstanz/Packages/Application/Neos.Neos.Ui/node_modules/@neos-project
 rm -rf react-ui-components
 ln -s ./../../../../../../react-ui-components/ .
```


run the watcher inside the react-ui-components

```
 npm run watch:build
```


run the watcher inside the Neos.Neos.Ui Package

```
 cd YourNeosUiInstanz/Packages/Application/Neos.Neos.Ui
 npm run watch:build
```

## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
