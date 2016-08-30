import React, {Component, PropTypes} from 'react';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import DropDown from '@neos-project/react-ui-components/lib/DropDown/';
import shallowCompare from 'react-addons-shallow-compare';

import {AspectRatioOption, NullAspectRatioStrategy} from '../model';
import style from './style.css';

class AspectRatioDropDownitem extends Component {
    static propTypes = {
        value: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {label} = this.props;

        return (
            <li className={style.dropDown__item} onClick={this.handleClick}>
                {label}
            </li>
        );
    }

    handleClick() {
        const {value, onClick} = this.props;

        onClick(value);
    }
}

export default class AspectRatioDropDown extends Component {
    static propTypes = {
        current: PropTypes.instanceOf(NullAspectRatioStrategy),
        options: PropTypes.arrayOf(
            PropTypes.instanceOf(AspectRatioOption)
        ),
        placeholder: PropTypes.string,

        onSelect: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {options, current, placeholder, onSelect, onClear} = this.props;

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    {current.label ? (
                        <div style={{position: 'relative'}}>
                            <DropDown.Header className={style.dropDown__btn}>
                                {current.label}
                            </DropDown.Header>
                            <IconButton icon="times" onClick={onClear} className={style.dropDown__clear}/>
                        </div>
                    ) : (
                        <DropDown.Header
                            className={[
                                style.dropDown__btn,
                                style['dropDown__btn--isPlaceholder']
                            ].join(' ')}
                            >
                            {placeholder}
                        </DropDown.Header>
                    )}
                    <DropDown.Contents className={style.dropDown__contents}>
                        {options.map((aspectRatioOption, index) => (
                            <AspectRatioDropDownitem
                                key={index}
                                value={aspectRatioOption}
                                label={aspectRatioOption.label}
                                onClick={onSelect}
                                />
                        ))}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
