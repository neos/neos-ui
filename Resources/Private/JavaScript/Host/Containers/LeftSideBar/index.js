import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SideBar} from '../../Components/';
import style from './style.css';

@connect()
export default class LeftSideBar extends Component {
    render() {
        return (
            <SideBar position="left" className={style.wrapper}>
              This is sparta!
            </SideBar>
        );
    }
}
