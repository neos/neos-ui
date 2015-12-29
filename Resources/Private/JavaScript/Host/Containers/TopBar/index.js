import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar, MenuToggler} from '../../Components/';
import style from './style.css';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top" className={style.wrapper}>
              <MenuToggler onClick={() => this.onMenuToggle()} />
            </Bar>
        );
    }

    onMenuToggle() {
        console.log('toggle menu...');
    }
}
