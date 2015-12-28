import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar} from '../../Components/';
import MenuToggler from './MenuToggler/';
import style from './style.css';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top" className={style.wrapper}>
              <MenuToggler />
            </Bar>
        );
    }
}
