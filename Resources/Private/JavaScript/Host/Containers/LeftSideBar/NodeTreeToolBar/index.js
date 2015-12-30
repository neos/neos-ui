import React, {Component} from 'react';
import * as buttons from './Buttons/';
import map from 'lodash.map';
import style from './style.css';

export default class NodeTreeToolBar extends Component {
    render() {
        return (
            <div className={style.toolBar}>
                {map(buttons, (Button, index) => <Button key={index} />)}
            </div>
        );
    }
}
