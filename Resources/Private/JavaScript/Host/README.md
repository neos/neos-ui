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

For building code which is compatible with the Neos UI, you need a way to access the Neos components like Buttons, etc, but also
we need to ensure that you use the same React instance as Neos.

Background: This part is more complicated than it seems at first thought, because the Webpack build system encapsulates everything
            and ensures we have no global state lying around.

Inside the folder `Extensibility/ApiDefinitionForConsumers`, the API parts which shall be exposed from the Host frame to other parts
of the system are defined. Thus, this part is ran in context of the `Host` frame.

On the other hand, in `Extensibility/API`, the *consumation* part of the API resides. This means this part of the API is included
*not* in the Host frame context, but you link against these parts in the Guest frame, the Inspector editors and others.
(TODO: include code snippet how this works in webpack config)


## Registry

TODO: explain concept of central registry, and develop it.
