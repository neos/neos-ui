import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {selectors} from '@neos-project/neos-ui-redux-store';
import NodeToolbar from './NodeToolbar/index';
import MarkActiveNodeAsFocused from './MarkActiveNodeAsFocused/index';
import AddEmptyContentCollectionOverlays from './AddEmptyContentCollectionOverlays/index';

import style from './style.css';

@connect($transform({
    focused: $get('cr.nodes.focused')
}))
export default class InlineUI extends PureComponent {
    static propTypes = {
        focused: PropTypes.shape({
            contextPath: PropTypes.string,
            fusionPath: PropTypes.string
        })
    };

    render() {
        const {focused} = this.props;

        if (!focused.get('contextPath')) {
            return null;
        }

        return (
            <div className={style.inlineUi} data-__neos__inlineUI="TRUE">
                <NodeToolbar {...focused.toJS()}/>
                <MarkActiveNodeAsFocused {...focused.toJS()}/>
                <AddEmptyContentCollectionOverlays/>
            </div>
        );

        // TODO: re-add EditorToolbar
    }
}
