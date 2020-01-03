import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

import style from './style.css';
import {renderToolbarComponents} from './Helpers/index';

@connect($transform({
    focusedNodeType: selectors.CR.Nodes.focusedNodeTypeSelector,
    currentlyEditedPropertyName: selectors.UI.ContentCanvas.currentlyEditedPropertyName,
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
@neos(globalRegistry => ({
    // ToDo: Just by searching I haven't found a reference to the `globalRegistry` prop within the Component, do we still need it?
    globalRegistry,
    toolbarRegistry: globalRegistry.get('ckEditor').get('richtextToolbar'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class EditorToolbar extends PureComponent {
    static propTypes = {
        focusedNodeType: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object,
            PropTypes.string
        ])),

        globalRegistry: PropTypes.object.isRequired,
        toolbarRegistry: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    UNSAFE_componentWillMount() {
        const {toolbarRegistry} = this.props;
        this.renderToolbarComponents = renderToolbarComponents(toolbarRegistry);
    }

    onToggleFormat = formattingRule => {
        getGuestFrameWindow().NeosCKEditorApi.toggleFormat(formattingRule);
    }

    render() {
        const {
            focusedNodeType,
            currentlyEditedPropertyName,
            formattingUnderCursor,
            nodeTypesRegistry
        } = this.props;
        const inlineEditorOptions = nodeTypesRegistry
            .getInlineEditorOptionsForProperty(focusedNodeType, currentlyEditedPropertyName);

        const classNames = mergeClassNames({
            [style.toolBar]: true
        });
        const renderedToolbarComponents = this.renderToolbarComponents(
            this.onToggleFormat,
            inlineEditorOptions,
            formattingUnderCursor
        );

        return (
            <div className={classNames}>
                <div className={style.toolBar__btnGroup}>
                    {renderedToolbarComponents}
                </div>
            </div>
        );
    }
}
