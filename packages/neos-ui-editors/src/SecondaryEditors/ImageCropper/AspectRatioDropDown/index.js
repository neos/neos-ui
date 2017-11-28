import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';

import {AspectRatioOption, NullAspectRatioStrategy} from '../model';
import style from './style.css';

class AspectRatioDropDownitem extends PureComponent {
    static propTypes = {
        value: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const {label} = this.props;

        return (
            <li className={style.dropDown__item} onClick={this.handleClick}>
                {label}
            </li>
        );
    }

    handleClick = () => {
        const {value, onClick} = this.props;

        onClick(value);
    }
}

export default class AspectRatioDropDown extends PureComponent {
    static propTypes = {
        current: PropTypes.instanceOf(NullAspectRatioStrategy),
        options: PropTypes.arrayOf(
            PropTypes.instanceOf(AspectRatioOption)
        ),
        placeholder: PropTypes.string,

        onSelect: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
        isLocked: PropTypes.bool
    };

    render() {
        const {options, current, placeholder, onSelect, onClear, isLocked} = this.props;

        const dropDownClasses = mergeClassNames({
            [style.dropDown]: true,
            [style['dropDown--disabled']]: isLocked
        });

        const dropDownHeaderClasses = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__btn--isPlaceholder']]: !current.label,
            [style['dropDown--disabled']]: isLocked
        });

        const iconButtonClasses = mergeClassNames({
            [style.dropDown__clear]: true,
            [style['dropDown--disabled']]: isLocked
        });

        return (
            <div className={style.wrapper}>
                <DropDown className={dropDownClasses}>
                    {current.label ? (
                        <div style={{position: 'relative'}}>
                            <DropDown.Header disabled={isLocked} className={dropDownHeaderClasses}>
                                {current.label}
                            </DropDown.Header>
                            <IconButton icon="times" onClick={isLocked ? null : onClear} className={iconButtonClasses}/>
                        </div>
                    ) : (
                        <DropDown.Header
                            disabled={isLocked}
                            className={dropDownHeaderClasses}
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
