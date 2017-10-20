import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './column.css';

export default class Column extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        label: PropTypes.string
    };

    render() {
        const {value, label} = this.props;
        return (
            <div className={style.column}>
                <div className={style.column__value}>{value}</div>
                <div className={style.column__label}>{label}</div>
            </div>
        );
    }
}
