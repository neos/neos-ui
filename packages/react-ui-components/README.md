# @neos-project/react-ui-components
[![Build Status](https://travis-ci.org/Inkdpixels/react-ui-components.svg?branch=master)](https://travis-ci.org/Inkdpixels/react-ui-components) [![Dependency Status](https://david-dm.org/Inkdpixels/react-ui-components.svg)](https://david-dm.org/Inkdpixels/react-ui-components) [![peerDependencies Status](https://david-dm.org/Inkdpixels/react-ui-components/peer-status.svg)](https://david-dm.org/Inkdpixels/react-ui-components?type=peer) [![devDependency Status](https://david-dm.org/Inkdpixels/react-ui-components/dev-status.svg)](https://david-dm.org/Inkdpixels/react-ui-components#info=devDependencies&view=table)
[![Slack](http://slack.neos.io/badge.svg)](http://slack.neos.io) [![Forum](https://img.shields.io/badge/forum-Discourse-39c6ff.svg)](https://discuss.neos.io/) [![Twitter](https://img.shields.io/twitter/follow/neoscms.svg?style=social)](https://twitter.com/NeosCMS)

> The UI components which power the Neos backend application.

## Dependencies
* classnames `^2.2.3`
* lodash.omit `^4.3.0`
* monet `^0.8.10`
* react `^15.2.1`
* react-click-outside `^2.1.0`
* react-collapse `^2.2.2`
* react-dom `^15.2.1`
* react-textarea-autosize `^4.0.0`
* react-height `^2.0.4`
* react-motion `^0.4.2`


## Installation
```
npm i -S @neos-project/react-ui-components
```

## Usage
To reduce the bundled size of applications, we enforce singular import statements of components.
You can import components by pointing to the `lib/` folder, f.e.
```js
import Button from '@neos-project/react-ui-components/lib/button/';
```

## Contributing
#### Requirements
* Node in version `^6.3.3`
* NPM in version `^3.10.3`

## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
