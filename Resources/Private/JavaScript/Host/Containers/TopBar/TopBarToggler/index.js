import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {I18n} from '../../../Components/';
import style from './style.css';

@connect()
export default class TopBarToggler extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        label: PropTypes.string.isRequired
    }

    render() {
        return (
            <button href="#" className={style.topBarToggler} onClick={this.onClick.bind(this)}>
                <I18n target={this.props.label} />
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
