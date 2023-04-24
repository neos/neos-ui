# @neos-project/neos-ui-extensibility

> Core of the extensibility mechanisms for the Neos UI

## Installation
```bash
yarn add @neos-project/neos-ui-extensibility
```

## Alternative
If you're here looking for the previously original shipped webpack build stack see [@neos-project/neos-ui-extensibility-webpack-adapter](https://github.com/neos/neos-ui/tree/8.3/packages/neos-ui-extensibility-webpack-adapter)

## Features

You don't need to recompile the Neos UI to integrate your own Plugins. Many core functionalities are accessible through the `@neos-project/neos-ui-extensibility` API.
This package provides the shims to access to the bespoken API and the alias map: `extensibilityMap.json` to be used for building a plugin.

All aliases are listed here: [@neos-project/neos-ui-extensibility/extensibilityMap.json](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility/extensibilityMap.json).
You only need to import the modules, and they will work as if you installed those packages.
So `import React from "react"` will import react at runtime from the Neos UI host, and you don't need to install it. (Also the same instance is used, which is important)


## General usage and Concept

A Neos UI plugin must get access to certain important objects and methods like React, CKEditor, and also the bootstrap function.

**Concept**
To access the same instance f.x. of React that the Neos UI Host is using, we technically want to do something like: `const {React} = window.NeosUiPluginApi`. The problem being: when we use 3rd party NPM packages in our plugin, they will import React as usual `import React from "react"` which will fail.
To solve this issue and also make creating plugins a bit more fancy ✨ we make use of your bundlers import alias feature.

The alias resolution will match any imported path against the `extensibilityMap.json` and redirect it to a shim. The shim will then access the Neos UI plugin API at runtime.

**Using alias with esbuild webpack and co**

Technically, any bundler, which has support for alias, _should_ work.

- [esbuild](https://esbuild.github.io/api/#alias)
- [webpack](https://webpack.js.org/configuration/resolve/#resolvealias)
- [rollup](https://www.npmjs.com/package/@rollup/plugin-alias)

## Opinionated usage with esbuild / Technical Neos UI plugin setup 

The following instructions will guide you to create a plugin with esbuild.
The plugin will be backwards compatible with Neos 7.3 too!

<details>
<summary>Advantages vs @neos-project/neos-ui-extensibility-webpack-adapter</summary>

```diff
+ Use Esbuild
- Cannot use Webpack
- Code splitting is more advanced in webpack
+ No need for Babel
+ Use latest ES Syntax
+ Fully controll the build process
+ Speeeeed
+ Way less dev dependencies -> faster installation.
```

</details>

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
  "name": "my-coolplugin",
  "version": "1.0.0",
  "scripts": {
    "build": "node build.js",
    "watch": "node build.js --watch"
  },
  "devDependencies": {
    "@neos-project/neos-ui-extensibility": "~8.3.0",
    "esbuild": "~0.17.18"
  }
}
```

now we create our own build script:
`build.js`
```js
const esbuild = require('esbuild');
const extensibilityMap = require("@neos-project/neos-ui-extensibility/extensibilityMap.json");
const isWatch = process.argv.includes('--watch');

/** @type {import("esbuild").BuildOptions} */
const options = {
  logLevel: "info",
  bundle: true,
  target: "es2020",
  entryPoints: { "Plugin": "src/index.js" },
  // add this loader mapping,
  // in case youre "missusing" javascript files as typescript-react files
  // - eg with `@neos` or `@connect` decorators
  loader: { ".js": "tsx" },
  outdir: "../../Public/NeosUserInterface",
  alias: extensibilityMap
}

if (isWatch) {
    esbuild.context(options).then((ctx) => ctx.watch())
} else {
    esbuild.build(options)
}
```

In the folder `Resources/Public/NeosUserInterface` we will gather the build artifacts, which can be created by running `yarn build`.

The build stack will create `Resources/Public/NeosUserInterface/Plugin.js` and also `Resources/Public/NeosUserInterface/Plugin.css`, if you imported any CSS¹.

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
            # esm support²
            # in case you want to use esbuild's code splitting (ESM only)
            # or just reference an ESM Plugin, set the type to module
            # attributes:
            #   type: module

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

In the manifest `src/manifest.js` we will register our plugin with access to the `globalRegistry`:
```js
import manifest from '@neos-project/neos-ui-extensibility';

manifest('My.CoolPlugin', {}, (globalRegistry) => {
  // ...
});
```

### ¹CSS handling in esbuild

In case you're writing a new plugin and want to use CSS-Modules, or want to migrate a plugin from the webpack-adapter to esbuild, then we recommend using this css-modules loader for esbuild:
[esbuild-plugin-lightningcss-modules](https://github.com/mhsdesign/esbuild-plugin-lightningcss-modules). The loader is the same used for building the Neos UI and thus provides the same features. Be aware, though, that by default only `.module.css` files are processed instead of all `.css` files, but it's recommended to quickly rename those.

### ²ESM plugin (ecmascript module in the browser)

In case you want to leverage for example esbuild's [code splitting](https://esbuild.github.io/api/#splitting) - which requires using `format: "esm"` you need to load the plugin as module `<src type=module`.
This is achievable via the attributes map:

```
resources:
  javascript:
    'My.CoolPlugin':
      resource: '...'
      attributes:
        type: module
```

## Documentation of the Neos UI extensibility api mechanics

For a deeper dive into the concepts of Neos UI plugins, visit the [documentation](https://docs.neos.io/guide/manual/extending-the-user-interface/react-extensibility-api)
