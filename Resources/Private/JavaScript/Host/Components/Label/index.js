import React, {Component, PropTypes} from 'react';
import style from './style.css';

export default class Label extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        htmlFor: PropTypes.string.isRequired
    }

    render() {
        const {
            label,
            htmlFor
        } = this.props;

        return (
            <label className={style.label} htmlFor={htmlFor}>{label}</label>
        );
    }
}
