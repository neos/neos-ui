# Debug Reason For Rendering - Why does React redraw a certain component?

(by the Neos Project - http://neos.io)

## Usage

1. Ensure you have decorators enabled in your project (this is the case e.g. for create-react-app).

2. Install the package: `yarn add --dev @neos-project/debug-reason-for-rendering`

3. Import the decorator function:

```
import debugReasonForRendering from '@neos-project/debug-reason-for-rendering';
```

4. (Option 1) Annotate your `shouldComponentUpdate` method with `@debugReasonForRendering`:

```
@debugReasonForRendering
shouldComponentUpdate(...args) {
    return shallowCompare(this, ...args);
}
```

4. (Option 2) Annotate your `PureComponent` class with `@debugReasonForRendering`:

```
@debugReasonForRendering
class MyComponent extends PureComponent {
    ...
}
```

5. Profit! (see Chrome console)

![Screenshot, explaining why updates are triggered](docs/screenshot.jpg?raw=true "Why is an update triggered?")

## License

MIT

Created with <3 by the Neos Team.

http://neos.io
