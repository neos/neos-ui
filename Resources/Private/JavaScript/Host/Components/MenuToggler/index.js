import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Icon from '../Icon/';
import style from './style.css';

@connect()
export default class MenuToggler extends Component {
    static propTypes = {
        onClick: PropTypes.func
    }
    render() {
        return (
          <a href="#" className={style.menuBtn} onClick={this.onClick.bind(this)}>
            <Icon icon="bars" size="big" />
          </a>
        );
    }

    onClick(e) {
        const {onClick} = this.props;

        e.preventDefault();

        if (onClick) {
            onClick();
        }
    }
}
