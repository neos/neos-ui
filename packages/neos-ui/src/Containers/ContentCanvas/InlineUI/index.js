import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';
import NodeToolbar from './NodeToolbar/index';
import MarkActiveNodeAsFocused from './MarkActiveNodeAsFocused/index';
import AddEmptyContentCollectionOverlays from './AddEmptyContentCollectionOverlays/index';

import style from './style.css';

@connect($transform({
    focusedNode: selectors.CR.Nodes.focusedSelector
}))
export default class InlineUI extends PureComponent {
    static propTypes = {
        focusedNode: PropTypes.object
    };

    render() {
        const {focusedNode} = this.props;

        if (!focusedNode) {
            return null;
        }

        return (
            <div className={style.inlineUi} data-__neos__inlineUI="TRUE">
                <NodeToolbar focusedNode={focusedNode}/>
                <MarkActiveNodeAsFocused focusedNode={focusedNode}/>
                <AddEmptyContentCollectionOverlays/>
            </div>
        );

        // TODO: re-add EditorToolbar
    }
}
