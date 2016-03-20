import React, {Component} from 'react';

import NodeToolbar from '../NodeToolbar/index';

import style from './style.css';

export default class InlineUI extends Component {
    render() {
        return (
            <div className={style.inlineUi}>
                <NodeToolbar />
            </div>
        );
    }
}
