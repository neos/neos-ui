import React, {Component, PropTypes} from 'react';
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
                value: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired,
                label: PropTypes.string.isRequired
            })
        ),
        placeholder: PropTypes.string,
        placeholderIcon: PropTypes.string,
        onSelect: PropTypes.func.isRequired
    };

    state = {
        value: ''
    };

    componentDidMount() {
        const {value} = this.props;

        this.select(value);
    }

    select(incomingValue) {
        const {options, placeholder, placeholderIcon} = this.props;
        const value = incomingValue || (placeholder ? '' : Maybe.fromNull(options[0]).map(o => o.value).orSome(''));

        this.setState({
            value,
            icon: options.filter(o => o.value === value).map(o => o.icon)[0] || placeholderIcon,
            label: options.filter(o => o.value === value).map(o => o.label)[0] || placeholder
        });
    }

    render() {
        const {options, placeholder, placeholderIcon, onSelect} = this.props;
        const {icon, label} = this.state;

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
                            .orSome('')}
                        {options.map(({icon, label, value}) => {
                            const onClick = () => {
                                this.select(value);
                                onSelect(value);
                            };

                            return (
                                <li
                                    className={style.dropDown__item}
                                    onClick={onClick}
                                    >
                                    {Maybe.fromNull(icon)
                                        .map(icon => <Icon className={style.dropDown__itemIcon} icon={icon} />)
                                        .orSome('')}
                                    {label}
                                </li>
                            );
                        })}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
