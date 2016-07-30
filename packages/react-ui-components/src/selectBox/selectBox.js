import React, {Component, PropTypes} from 'react';
import {Maybe} from 'monet';
import Icon from './../icon/index';
import DropDown from './../dropDown/index';

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
        onSelect: PropTypes.func.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'wrapper': PropTypes.string,
            'dropDown': PropTypes.string,
            'dropDown__btn': PropTypes.string,
            'dropDown__btnIcon': PropTypes.string,
            'dropDown__contents': PropTypes.string,
            'dropDown__item': PropTypes.string,
            'dropDown__itemIcon': PropTypes.string
        }).isRequired
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
        const {options, placeholder, placeholderIcon, onSelect, theme} = this.props;
        const {icon, label} = this.state;

        return (
            <div className={theme.wrapper}>
                <DropDown className={theme.dropDown}>
                    <DropDown.Header className={theme.dropDown__btn}>
                        {Maybe.fromNull(icon)
                            .map(icon => <Icon className={theme.dropDown__btnIcon} icon={icon} />)
                            .orSome('')}
                        {label}
                    </DropDown.Header>
                    <DropDown.Contents className={theme.dropDown__contents}>
                        {Maybe.fromNull(placeholder)
                            .map(placeholder => (
                                <li className={theme.dropDown__item}>
                                    {Maybe.fromNull(placeholderIcon)
                                        .map(icon => <Icon className={theme.dropDown__itemIcon} icon={icon} />)
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
                                    className={theme.dropDown__item}
                                    onClick={onClick}
                                    >
                                    {Maybe.fromNull(icon)
                                        .map(icon => <Icon className={theme.dropDown__itemIcon} icon={icon} />)
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
