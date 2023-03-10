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
The lib is already compiled for you to bare ES2020 Javascript and CSS. So just roll with any simple $bundler ;)

### Font specialties

You should also install `notosans-fontface` from our peerDependencies and import the `Noto Sans` Font as the components rely on it. See [example](example).


### `<Icon/>` specialties

Icons require you to import and configure Font Awesome properly.
An example config could look like this: (See [example](example))

```js
import { Icon } from '@neos-project/react-ui-components';

import { config, library } from '@fortawesome/fontawesome-svg-core';
// here we import all the solid icons (which is bad for bundle size, but might be necessary)
import { fas } from '@fortawesome/free-solid-svg-icons';
// but you can also only include a certain icon you'd like
import { faNeos } from '@fortawesome/free-brands-svg-icons/faNeos';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false; // Dont insert the supporting CSS into the <head> of the HTML document
library.add(
    fas,
    faNeos,
)

export const Component = () => (
    <Icon icon="neos" />
)
```

### Example

See the [example](example) folder for a minimal setup.
You can build it with a super simple esbuild command or use the alias:

```sh
yarn workspace @neos-project/react-ui-components example --minify
```

## Usage within in a Neos.Ui plugin?

You dont actually need to require this plugin when building a pure Neos.Ui Plugin like you dont need `react` installed as well. Your plugin will import `@neos-project/react-ui-components` from the "`window` export" of the Neos.Ui Host.

You still might want to install this package to have typescript autocompletion and type safety ;)

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

## Contributing

### Setup

Proceed with the instructions from the monorepo: [Neos.Neos.Ui](https://github.com/neos/neos-ui)

### Test the development version of `@neos-project/react-ui-components` in your project

Inside your [Neos.Neos.Ui](https://github.com/neos/neos-ui) development setup build and pack the `@neos-project/react-ui-components`:

```sh
yarn workspace @neos-project/react-ui-components build
yarn workspace @neos-project/react-ui-components pack
```

Then you will receive a `package.tgz` which holds essentially the same contents that would have been published to npm.

You can add it for testing to your project by simply going to your project and adding the `package.tgz`:

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
