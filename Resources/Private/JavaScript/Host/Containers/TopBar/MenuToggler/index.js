import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {Button} from '../../../Components/';
import style from './style.css';

@connect()
export default class MenuToggler extends Component {
    static propTypes = {
        className: PropTypes.string
    };

    render() {
        const {className} = this.props;

        return (
            <Button
                className={className}
                style="clean"
                hoverStyle="clean"
                onClick={this.onMenuToggle.bind(this)}
                >
                <div className={style.menuIcon}></div>
            </Button>
        );
    }

    onMenuToggle() {
        console.log('toggle menu...');
    }
}
