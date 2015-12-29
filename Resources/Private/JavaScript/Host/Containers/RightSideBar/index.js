import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SideBar} from '../../Components/';
import style from './style.css';

@connect()
export default class LeftSideBar extends Component {
    render() {
        return (
            <SideBar position="right" className={style.wrapper}>
              This is not sparta!
            </SideBar>
        );
    }
}
