import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './hero.module.css';

export default class Hero extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        label: PropTypes.string
    };

    render() {
        const {value, label} = this.props;
        return (
            <div className={style.hero}>
                <div className={style.hero__value}>{value}</div>
                <div className={style.hero__label}>{label}</div>
            </div>
        );
    }
}
