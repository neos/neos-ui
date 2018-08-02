import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import * as plow from 'plow-js';
import classnames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as reactRedux from 'react-redux';
import * as reduxActions from 'redux-actions';
import * as reduxSaga from 'redux-saga';
import * as reduxSagaEffects from 'redux-saga/effects';
import * as reselect from 'reselect';
import * as reactCssThemr from '@friendsofreactjs/react-css-themr';

import ReactUiComponents from '@neos-project/react-ui-components';
import * as NeosUiReduxStore from '@neos-project/neos-ui-redux-store';
import * as NeosUiDecorators from '@neos-project/neos-ui-decorators';
import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';
import * as UtilsRedux from '@neos-project/utils-redux';
import NeosUiI18n from '@neos-project/neos-ui-i18n';
import * as CkEditorApi from '@neos-project/neos-ui-ckeditor5-bindings/src/ckEditorApi';
import NeosUiBackendConnectorDefault, * as NeosUiBackendConnector from '@neos-project/neos-ui-backend-connector';
import * as NeosUiViews from '@neos-project/neos-ui-views';

export default {
    '@vendor': () => ({
        React,
        ReactDOM,
        PropTypes,
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
        NeosUiBackendConnectorDefault,
        NeosUiBackendConnector,
        CkEditorApi,
        NeosUiDecorators,
        NeosUiEditors: EditorEnvelope,
        NeosUiI18n,
        NeosUiReduxStore,
        NeosUiViews,
        // react-proptypes (optional)
        ReactUiComponents,
        UtilsRedux

        // TODO: how to write new reducers?
        // TODO: how to write new sagas? -> Registry --> CUSTOM PACKAGE
        // TODO: How to replace containers -> Registry --> CUSTOM PACKAGE
    })
};
