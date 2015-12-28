import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Icon} from '../../../Components/';
import style from './style.css';

@connect()
export default class MenuToggler extends Component {
    render() {
        return (
          <a href="#" className={style.menuBtn} onClick={this.onClick.bind(this)}>
            <Icon icon="bars" size="big" />
          </a>
        );
    }

    onClick(e) {
        e.preventDefault();

        console.log('open the menu');
    }
}
