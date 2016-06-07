import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {Maybe} from 'monet';

import Icon from 'Components/Icon/index';
import DropDown from 'Components/DropDown/index';

import style from './style.css';

export default class SelectBox extends Component {
    static propTypes = {
        value: PropTypes.string,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                icon: PropTypes.string,
                value: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired
            })
        ),
        placeholder: PropTypes.string,
        placeholderIcon: PropTypes.string
    };

    state = {
        value: ''
    };

    componentDidMount() {
        const {value} = this.props;

        this.select(value);
    }

    select(value) {
        const {options, placeholder, placeholderIcon} = this.props;

        this.setState({
            icon: options.filter(o => o.value === value).map(o => o.icon)[0] || placeholderIcon,
            label: options.filter(o => o.value === value).map(o => o.label)[0] || placeholder,
            value: value || Maybe.fromNull(options[0]).map(o => o.value).orSome('')
        });
    }

    render() {
        const {options, placeholder, placeholderIcon, onSelect} = this.props;
        const {icon, value, label} = this.state;

        console.log(icon, value, label);

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn}>
                        {Maybe.fromNull(icon)
                            .map(icon => <Icon className={style.dropDown__btnIcon} icon={icon} />)
                            .orSome('')}
                        {label}
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        {Maybe.fromNull(placeholder)
                            .map(placeholder => (
                                <li className={style.dropDown__item}>
                                    {Maybe.fromNull(placeholderIcon)
                                        .map(icon => <Icon className={style.dropDown__itemIcon} icon={icon} />)
                                        .orSome('')}
                                    {placeholder}
                                </li>
                            ))
                            .orSome('TEST')}
                        {options.map(({icon, label, value}) => (
                            <li
                                className={style.dropDown__item} onClick={() => {
                                    this.select(value);
                                    onSelect(value);
                                }}
                                >
                                {Maybe.fromNull(icon)
                                    .map(icon => <Icon className={style.dropDown__itemIcon} icon={icon} />)
                                    .orSome('')}
                                {label}
                            </li>
                        ))}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
