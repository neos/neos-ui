import React from 'react';
import Immutable from 'immutable';
import * as plow from 'plow-js';
import classnames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as reactRedux from 'react-redux';
import * as reduxActions from 'redux-actions';
import * as reduxSaga from 'redux-saga';
import * as reduxSagaEffects from 'redux-saga/effects';
import * as reselect from 'reselect';
import * as reactCssThemr from 'react-css-themr';

import ReactUiComponents from '@neos-project/react-ui-components';
import * as NeosUiDecorators from '@neos-project/neos-ui-decorators';
import NeosUiI18n from '@neos-project/neos-ui-i18n';

export default {
    '@vendor': () => ({
        React,
        Immutable,
        plow,
        classnames,
        ImmutablePropTypes,
        reactRedux,
        reduxActions,
        reduxSaga,
        reduxSagaEffects,
        reselect,
        reactCssThemr
    }),

    '@NeosProjectPackages': () => ({
        // neos-ui-backend-connector
        NeosUiDecorators,
        NeosUiI18n,
        // neos-ui-redux-store
        // react-proptypes (optional)
        ReactUiComponents

        // TODO: how to write new reducers?
        // TODO: how to write new sagas? -> Registry --> CUSTOM PACKAGE
        // TODO: How to replace containers -> Registry --> CUSTOM PACKAGE
    })
};
