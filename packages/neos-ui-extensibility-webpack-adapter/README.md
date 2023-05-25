# @neos-project/neos-ui-extensibility-webpack-adapter

> Minimal configuration, highly opinionated Webpack 4 + Babel plugin build stack for the Neos CMS UI.

## Installation
```bash
yarn add -D @neos-project/neos-ui-extensibility-webpack-adapter
```

## Alternative: Esbuild, vanilla Webpack5 (or any buildsystem with alias resolution)
If you prefer a less opinionated and modern build stack - or better, just want to choose and fully configure the bundler yourself - visit [@neos-project/neos-ui-extensibility](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility) to use the Neos UI plugin API directly.

Note that this adapter uses a build stack created some time ago (Webpack4 + Babel) and exists mostly for convenience/backwards-compatibility, but is not state of the art and might never be again. So in case you're thinking about patching a new loader/option into the `webpack.config.js` you might as well just use Webpack directly or try out esbuild ;).

## Migrating from Neos =< 8.2 `@neos-project/neos-ui-extensibility`

Previously - before Neos 8.3 - the functionality of this package was provided via `@neos-project/neos-ui-extensibility`. Now `@neos-project/neos-ui-extensibility` is a code-only repo and does not ship any build system.
To migrate your plugin, just reference this package as a dependency:

```diff
"devDependencies": {
-  "@neos-project/neos-ui-extensibility": "~8.2.0",
-  "@neos-project/build-essentials": "~8.2.0"
+  "@neos-project/neos-ui-extensibility-webpack-adapter": "~8.3.0"
}
```

## Features

You don't need to recompile the Neos UI to integrate your own Plugins. Many Core functionalities are accessible through the `@neos-project/neos-ui-extensibility` API.
This package provides an opinionated Webpack build stack to access the bespoken API.

All available aliases are listed here: [@neos-project/neos-ui-extensibility/extensibilityMap.json](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility/extensibilityMap.json).
You only need to import the modules, and they will work as if you installed those packages.
So `import React from "react"` will import React at runtime from the Neos UI host and you don't need to install it. (Also the same instance is used, which is important)


## Usage / Technial Neos Ui plugin setup 

Creating a basic UI plugin package:

You have free choice about the directory structure (except that the `"buildTargetDirectory"` must point to the `Resources/Public` folder) 

<details>
<summary>Example File structure</summary>

```
- My.CoolPlugin
	- Configuration
		- Settings.yaml
	- Resources
		- Private
			- NeosUserInterface
				- src
					- index.js
					- manifest.js
				- package.json

		# created on build ...
		- Public 
			- NeosUserInterface
				- Plugin.js
				- Plugin.js.map
```

</details>

We place the plugin in `Resources/Private/NeosUserInterface`:

`package.json`
```json
{
  "description": "my-coolplugin",
    "scripts": {
      "build": "NODE_ENV=production neos-react-scripts build",
      "watch": "neos-react-scripts watch"
  },
	"main": "./src/index.js",
  "neos": {
    "buildTargetDirectory": "../../Public/NeosUserInterface"
  },
  "devDependencies": {
    "@neos-project/neos-ui-extensibility-webpack-adapter": "~8.3.0"
  }
}
```

In the folder `Resources/Public/NeosUserInterface` we will gather the build artifacts, which can be created by running `yarn build`. Keep in mind to set `NODE_ENV=production` as, otherwise the build files will not be minified.

The build stack will create `Resources/Public/NeosUserInterface/Plugin.js` and also `Resources/Public/NeosUserInterface/Plugin.css`, if you used any CSS.

To include these files in the Neos UI, you need to register your plugin in the YAML configuration:

`Settings.yaml`
```yaml
Neos:
  Neos:
    Ui:
      resources:
        javascript:
          'My.CoolPlugin':
            resource: 'resource://My.CoolPlugin/Public/Plugin/NeosUserInterface/Plugin.js'
        # optional if youre using css
        stylesheets:
          'My.CoolPlugin':
            resource: 'resource://My.CoolPlugin/Public/Plugin/NeosUserInterface/Plugin.css'
```

Now you can get started with your plugin.

By convention your `src/index.js` will import the manifest:
```js
import './manifest.js'
```

In the manifest `src/manifest.js` we will register our plugin with access to the globalRegistry:
```js
import manifest from '@neos-project/neos-ui-extensibility';

manifest('My.CoolPlugin', {}, (globalRegistry) => {
  // ...
});
```

## Advanced concepts

If you're importing CSS files, they will be treated as CSS modules - to avoid any preprocessing, use `.vanilla-css` as a suffix.

We strongly suggest looking into creating your own build stack as described in [@neos-project/neos-ui-extensibility](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility) as this gives you great leverage about your tooling.

## Documentation of the Neos UI extensibility API mechanics

For a deeper dive into concepts of Neos UI plugins, visit the [documentation](https://docs.neos.io/guide/manual/extending-the-user-interface/react-extensibility-api)
