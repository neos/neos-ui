# Neos.Neos.Ui Extensibility

## API

### External libraries

- React (version X.Y)
- immutable
- plow-js
- classnames
- react-immutable-proptypes
- react-redux
- redux-actions
- redux-saga
- redux-saga/effects
- reselect


### API libraries which can be included:

-  `import {TextField} from '@neos-project/react-ui-components';`
- `import {neos} from '@neos-project/neos-ui-decorators';`
- `import I18n from '@neos-project/neos-ui-i18n';`


### Registry Structure

- `globalRegistry.get('richtextToolbar')`
- `globalRegistry.get('ckEditor').get('formattingRules');`
- `globalRegistry.get('i18n')`


- `globalRegistry.get('containers')`


### CONTAINER registry

- ContentCanvas
- FullScreen
- Modals