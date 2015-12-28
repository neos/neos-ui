import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar, Icon} from '../Components/';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top">
                <Icon icon="fa-music" />
                <Icon icon="icon-music" />
                <div style={{lineHeight: '41px', paddingLeft: '1em'}}>I-Frame Example</div>
            </Bar>
        );
    }
}
