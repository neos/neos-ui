import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar} from '../../Components/';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top">
                <div style={{lineHeight: '41px', paddingLeft: '1em'}}>I-Frame Example</div>
            </Bar>
        );
    }
}
