import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import style from './style.css';

@connect()
export default class MenuToggler extends Component {
    static propTypes = {
        onClick: PropTypes.func
    }

    render() {
        return (
          <button className={style.menuBtn} onClick={this.onClick.bind(this)}></button>
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
