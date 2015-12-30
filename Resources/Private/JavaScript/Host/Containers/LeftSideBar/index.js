import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SideBar} from '../../Components/';
import NodeTreeToolBar from './NodeTreeToolBar/';
import style from './style.css';

@connect()
export default class LeftSideBar extends Component {
    render() {
        return (
            <SideBar position="left" className={style.leftSideBar}>
                <NodeTreeToolBar />
                This is sparta!
            </SideBar>
        );
    }
}
