import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';
import NodeToolbar from './NodeToolbar/index';
import MarkActiveNodeAsFocused from './MarkActiveNodeAsFocused/index';
import MarkHoveredNodeAsHovered from './MarkHoveredNodeAsHovered/index';
import AddEmptyContentCollectionOverlays from './AddEmptyContentCollectionOverlays/index';

import style from './style.css';

@connect($transform({
    hoveredNode: selectors.CR.Nodes.hoveredSelector,
    focusedNode: selectors.CR.Nodes.focusedSelector
}))
export default class InlineUI extends Component {
    static propTypes = {
        hoveredNode: PropTypes.object,
        focusedNode: PropTypes.object
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {focusedNode, hoveredNode} = this.props;

        if (!focusedNode && !hoveredNode) {
            return null;
        }

        return (
            <div className={style.inlineUi} data-__neos__inlineUI="TRUE">
                <NodeToolbar focusedNode={focusedNode}/>
                <MarkActiveNodeAsFocused focusedNode={focusedNode}/>
                <MarkHoveredNodeAsHovered focusedNode={focusedNode} hoveredNode={hoveredNode}/>
                <AddEmptyContentCollectionOverlays/>
            </div>
        );

        // TODO: re-add EditorToolbar
    }
}
