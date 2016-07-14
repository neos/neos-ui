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







Host/Extensibility
  * ApiDefinitionForConsumers: contains the part of Neos, React, ... which make sense for other artifacts (JS files) which want to hook into Neos, contains the part which EXPOSES the API
  * Api: (what you link to inside the guest), contains React basics, shared Components, Registry!

  * Registry: as second part...
