import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import NodeToolbar from './NodeToolbar/index';
import MarkActiveNodeAsFocused from './MarkActiveNodeAsFocused/index';
import AddEmptyContentCollectionOverlays from './AddEmptyContentCollectionOverlays/index';

import style from './style.css';

@connect($transform({
    focused: $get('cr.nodes.focused')
}))
export default class InlineUI extends PureComponent {
    static propTypes = {
        focused: PropTypes.object
    };

    render() {
        const focused = this.props.focused.toJS();

        return (
            <div className={style.inlineUi} data-__neos__inlineUI="TRUE">
                <NodeToolbar {...focused}/>
                <MarkActiveNodeAsFocused {...focused}/>
                <AddEmptyContentCollectionOverlays/>
            </div>
        );
    }
}
