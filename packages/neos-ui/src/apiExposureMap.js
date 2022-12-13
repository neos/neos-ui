import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as plow from 'plow-js';
import classnames from 'classnames';
import * as reactRedux from 'react-redux';
import * as reduxActions from 'redux-actions';
import * as reduxSaga from 'redux-saga';
import * as reduxSagaEffects from 'redux-saga/effects';
import * as reselect from 'reselect';
import * as reactCssThemr from '@friendsofreactjs/react-css-themr';
import * as ReactDND from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ReactUiComponents from '@neos-project/react-ui-components';
import * as NeosUiReduxStore from '@neos-project/neos-ui-redux-store';
import * as NeosUiDecorators from '@neos-project/neos-ui-decorators';
import * as NeosUiEditors from '@neos-project/neos-ui-editors/src/index';
import * as UtilsRedux from '@neos-project/utils-redux';
import NeosUiI18n from '@neos-project/neos-ui-i18n';
import * as CkEditorApi from '@neos-project/neos-ui-ckeditor5-bindings/src/ckEditorApi';
import NeosUiBackendConnectorDefault, * as NeosUiBackendConnector from '@neos-project/neos-ui-backend-connector';
import * as NeosUiViews from '@neos-project/neos-ui-views';
import * as NeosUiGuestFrameDom from '@neos-project/neos-ui-guest-frame/src/dom';

// We export most needed components from CKE5 to be used when making custom plugins.
// It's not safe to just install CKE5 packages from the extension because then then "instanceof" checks will no longer work,
// which would break CKE5 in some places.
// Feel free to export more parts as needed.
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import {toWidget, viewToModelPositionOutsideModelElement} from '@ckeditor/ckeditor5-widget/src/utils';
import HighlightEditing from '@ckeditor/ckeditor5-highlight/src/highlightediting';

import ModelDocument from '@ckeditor/ckeditor5-engine/src/model/document';
import ModelDocumentFragment from '@ckeditor/ckeditor5-engine/src/model/documentfragment';
import ModelDocumentSelection from '@ckeditor/ckeditor5-engine/src/model/documentselection';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ModelNode from '@ckeditor/ckeditor5-engine/src/model/node';
import ModelNodeList from '@ckeditor/ckeditor5-engine/src/model/nodelist';
import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelSchema from '@ckeditor/ckeditor5-engine/src/model/schema';
import ModelSelection from '@ckeditor/ckeditor5-engine/src/model/selection';
import ModelText from '@ckeditor/ckeditor5-engine/src/model/text';
import ModelTextProxy from '@ckeditor/ckeditor5-engine/src/model/textproxy';
import ModelTreeWalker from '@ckeditor/ckeditor5-engine/src/model/treewalker';
import ModelWriter from '@ckeditor/ckeditor5-engine/src/model/writer';

import ViewAttributeElement from '@ckeditor/ckeditor5-engine/src/view/attributeelement';
import ViewContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import ViewDocument from '@ckeditor/ckeditor5-engine/src/view/document';
import ViewDocumentFragment from '@ckeditor/ckeditor5-engine/src/view/documentfragment';
import ViewDocumentSelection from '@ckeditor/ckeditor5-engine/src/view/documentselection';
import ViewDOMConverter from '@ckeditor/ckeditor5-engine/src/view/domconverter';
import ViewEditableElement from '@ckeditor/ckeditor5-engine/src/view/editableelement';
import ViewElement from '@ckeditor/ckeditor5-engine/src/view/element';
import ViewEmptyElement from '@ckeditor/ckeditor5-engine/src/view/emptyelement';
import * as ViewFiller from '@ckeditor/ckeditor5-engine/src/view/filler';
import ViewMatcher from '@ckeditor/ckeditor5-engine/src/view/matcher';
import ViewNode from '@ckeditor/ckeditor5-engine/src/view/node';
import * as ViewPlaceholder from '@ckeditor/ckeditor5-engine/src/view/placeholder';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';
import ViewRenderer from '@ckeditor/ckeditor5-engine/src/view/renderer';
import ViewSelection from '@ckeditor/ckeditor5-engine/src/view/selection';
import ViewText from '@ckeditor/ckeditor5-engine/src/view/text';
import ViewTextProxy from '@ckeditor/ckeditor5-engine/src/view/textproxy';
import ViewTreeWalker from '@ckeditor/ckeditor5-engine/src/view/treewalker';
import ViewUIElement from '@ckeditor/ckeditor5-engine/src/view/uielement';
import View from '@ckeditor/ckeditor5-engine/src/view/view';
import DownCastWriter from '@ckeditor/ckeditor5-engine/src/view/downcastwriter';

const CkEditor5 = {
    Plugin,
    Command,
    Widget,
    toWidget,
    viewToModelPositionOutsideModelElement,
    HighlightEditing,
    ModelDocument,
    ModelDocumentFragment,
    ModelDocumentSelection,
    ModelElement,
    ModelNode,
    ModelNodeList,
    ModelPosition,
    ModelRange,
    ModelSchema,
    ModelSelection,
    ModelText,
    ModelTextProxy,
    ModelTreeWalker,
    ModelWriter,
    ViewAttributeElement,
    ViewContainerElement,
    ViewDocument,
    ViewDocumentFragment,
    ViewDocumentSelection,
    ViewDOMConverter,
    ViewEditableElement,
    ViewElement,
    ViewEmptyElement,
    ViewFiller,
    ViewMatcher,
    ViewNode,
    ViewPlaceholder,
    ViewPosition,
    ViewRange,
    ViewRenderer,
    ViewSelection,
    ViewText,
    ViewTextProxy,
    ViewTreeWalker,
    ViewUIElement,
    View,
    DownCastWriter
};

export default {
    '@vendor': () => ({
        React,
        ReactDOM,
        PropTypes,
        plow,
        classnames,
        reactRedux,
        reduxActions,
        reduxSaga,
        reduxSagaEffects,
        reselect,
        reactCssThemr,
        CkEditor5,
        HTML5Backend,
        ReactDND
    }),

    '@NeosProjectPackages': () => ({
        NeosUiBackendConnectorDefault,
        NeosUiBackendConnector,
        CkEditorApi,
        NeosUiDecorators,
        NeosUiEditors,
        NeosUiI18n,
        NeosUiReduxStore,
        NeosUiViews,
        NeosUiGuestFrameDom,
        // react-proptypes (optional)
        ReactUiComponents,
        UtilsRedux

        // TODO: how to write new reducers?
        // TODO: how to write new sagas? -> Registry --> CUSTOM PACKAGE
        // TODO: How to replace containers -> Registry --> CUSTOM PACKAGE
    })
};
