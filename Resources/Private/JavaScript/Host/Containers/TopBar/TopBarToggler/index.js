import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import style from './style.css';

@connect()
export default class TopBarToggler extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        label: PropTypes.string.isRequired
    }

    render() {
        const {label} = this.props;

        return (
          <button href="#" className={style.toggler} onClick={this.onClick.bind(this)}>
            {label}
          </button>
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
