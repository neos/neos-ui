# Neos.Neos.Ui Extensibility

**WARNING**: The extensibility API described here is still subject to change; and not yet finalized.

## API

### External libraries

The following external libraries are shipped within Neos; and you can simply require them. It will just work,
without specifying them in package.json.

- React 15.4.0
    - React-DOM 15.4.0
- immutable.js 3.8.0
- plow-js 1.2.0
- classnames 2.2.3
- react-immutable-proptypes 2.0.0
- react-redux 4.4.5
- redux-actions 0.12.0
- redux-saga 0.12.0
- redux-saga/effects 0.12.0
- reselect 2.4.0
- react-css-themr 1.2.0


### Neos API libraries which can be included:

- React UI components: `import {TextField} from '@neos-project/react-ui-components';`
- Neos UI Decorator: `import {neos} from '@neos-project/neos-ui-decorators';`
- I18n Helper: `import I18n from '@neos-project/neos-ui-i18n';`

### Registry Structure

- `globalRegistry.get('richtextToolbar')`
- `globalRegistry.get('ckEditor').get('formattingRules');`
- `globalRegistry.get('i18n')`
- `globalRegistry.get('containers')`
- ... TODO: list further registries

### CONTAINER registry

This is UNPLANNED extensibility; so handle with care!
