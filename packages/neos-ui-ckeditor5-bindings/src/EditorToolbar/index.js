import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {executeCommand} from './../ckEditorApi';

import EditorToolbar from './EditorToolbar';

export {EditorToolbar};

@connect($transform({
    focusedNodeType: selectors.CR.Nodes.focusedNodeTypeSelector,
    currentlyEditedPropertyName: selectors.UI.ContentCanvas.currentlyEditedPropertyName,
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor
}))
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class InlineEditorToolbar extends PureComponent {
    static propTypes = {
        focusedNodeType: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object,
            PropTypes.string
        ])),
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    render() {
        const {
            focusedNodeType,
            currentlyEditedPropertyName,
            formattingUnderCursor,
            nodeTypesRegistry
        } = this.props;
        const editorOptions = nodeTypesRegistry
            .getInlineEditorOptionsForProperty(focusedNodeType, currentlyEditedPropertyName);

        return (
            <EditorToolbar
                executeCommand={executeCommand}
                editorOptions={editorOptions}
                formattingUnderCursor={formattingUnderCursor}
            />
        );
    }
}
