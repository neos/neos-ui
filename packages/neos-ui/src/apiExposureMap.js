import React from 'react';

import ReactUiComponents from '@neos-project/react-ui-components';

export default  {
    '@vendor': () => ({
        React
    }),

    // TODO: immutable, plow-js, classnames, react-immutable-proptypes, react-redux, redux-actions, redux-saga, reselect

    // TODO: make SemVer check at runtime for compatibility of API...

    '@NeosProjectPackages': () => ({
        // neos-ui-backend-connector
        // neos-ui-decorators
        // neos-ui-i18n
        // neos-ui-redux-store
        // react-proptypes (optional)
        ReactUiComponents

        // TODO: how to write new reducers?
        // TODO: how to write new sagas? -> Registry --> CUSTOM PACKAGE
        // TODO: How to replace containers -> Registry --> CUSTOM PACKAGE
    })
}