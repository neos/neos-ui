# Host

... contains code relevant to the main Neos UI (A.K.A outer frame, host frame)

Structure:

* Containers: React components depending on the Redux Store
* Decorators: TODO: find other place or name??
* Plugins: TODO
* Redux: contains the Redux store
* Sagas: long-running processes, Redux sagas
* Selectors: TODO: make as part of Redux
* Service: TODO




# Extensibility

Neos is aimed for run-time extensibility; i.e. you should be able to just add another JavaScript file to be loaded,
and this will modify the Neos behavior accordingly.

In order to do that, all extension points are defined in a so-called *registry* (see below).

## Registry

The system is extensible at various points using a bunch of *registries*. Examples for registry contents are:

* Which stylings should be applied for CKeditor
* What buttons should be available in the editor toolbar
* (coming soon) which inspector editors are available.

The registry is filled on application start in a so-called `manifest.js` file, which looks as follows:

```
import manifest from 'Host/Extensibility/API/Manifest/index';

manifest('main', (registry) => {
    // Here, you get passed in the "registy" instance.
    registry.ckEditor.formattingAndStyling.add('p', {style: {element: 'p'}});
});
```


## Module Loading



## Internals

For building code which is compatible with the Neos UI, you need a way to access the Neos components like Buttons, etc, but also
we need to ensure that you use the same React instance as Neos.

Background: This part is more complicated than it seems at first thought, because the Webpack build system encapsulates everything
            and ensures we have no global state lying around.

Inside the folder `Extensibility/ApiDefinitionForConsumers`, the API parts which shall be exposed from the Host frame to other parts
of the system are defined. Thus, this part is ran in context of the `Host` frame.

On the other hand, in `Extensibility/API`, the *consumation* part of the API resides. This means this part of the API should be
linked against in every other file.

