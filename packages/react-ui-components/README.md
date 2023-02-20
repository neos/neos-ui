# @neos-project/react-ui-components
[![Dependency Status](https://david-dm.org/neos/react-ui-components.svg)](https://david-dm.org/neos/react-ui-components) [![peerDependencies Status](https://david-dm.org/neos/react-ui-components/peer-status.svg)](https://david-dm.org/neos/react-ui-components?type=peer) [![devDependency Status](https://david-dm.org/neos/react-ui-components/dev-status.svg)](https://david-dm.org/neos/react-ui-components#info=devDependencies&view=table)
[![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

> The UI components which power the Neos backend application.

## Dependencies
This package requires some peerDependencies which you need to install after installing this package, see the [package.json](https://github.com/neos/react-ui-components/blob/master/package.json#L98).

## Installation
```
yarn add @neos-project/react-ui-components
```

## Usage (general with styling)

You can simply import the components:

```js
import { Button } from '@neos-project/react-ui-components';
```

Since version 8.3 you dont even need to have a css modules plugin for bundling installed.
Its already compiled for you to bare ES2020 Javascript and CSS. So just roll with a simple $bundler script ;)

## Usage within in a Neos.Ui plugin?

you dont actually need to require this pluging when building a pure Neos.Ui Plugin like you dont need react installed aswell. Your plugin will import `@neos-project/react-ui-components` from the "`window` export" of the Neos.Ui Host.

You still might want to install this package to have typescript autocompletion and typesafety ;)

## Advanced Usage: Without styling

You can also use the components without any styles provided by this package, but bear in mind that each component
requires a `theme` prop with the `classNames` you need to provide.

In case you want to use the components purely, adjust the import statement to point to the `unstyled` export:
```js
import { Button } from '@neos-project/react-ui-components/unstyled';
```

## Advanced Usage: Theming
All styled components can be themed using the [react-css-themr](https://github.com/javivelasco/react-css-themr) package,
visit their docs for more information about how this approach works. Our identifiers can be imported e.g.
```js
import identifiers from '@neos-project/react-ui-components/identifiers';
```

... todo implement above

## Todo Explain Icon Usage ...


## Contributing

### Setup

Proceed with the instruction from here: [Neos.Neos.Ui](https://github.com/neos/neos-ui)

### Add the Development version of `@neos-project/react-ui-components`

Inside your [Neos.Neos.Ui](https://github.com/neos/neos-ui) development Setup navigate to the `@neos-project/react-ui-components` package and build and pack it:

```sh
yarn workspace @neos-project/react-ui-components build
yarn workspace @neos-project/react-ui-components pack
```

then you will receive a `package.tgz` which holds essentially the same contents that would have been published to npm.

you can add it for testing to your other project by simply going to your project and adding the `package.tgz`

```sh
yarn add path/to/the/package.tgz
```

## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
