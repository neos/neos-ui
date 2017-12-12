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
        onClear: PropTypes.func.isRequired
    };

    render() {
        const {options, current, placeholder, onSelect, onClear} = this.props;

        const dropDownHeaderClasses = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__btn--isPlaceholder']]: !current.label
        });

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    {current.label ? (
                        <div style={{position: 'relative'}}>
                            <DropDown.Header className={dropDownHeaderClasses}>
                                {current.label}
                            </DropDown.Header>
                            <IconButton icon="times" onClick={onClear} className={style.dropDown__clear}/>
                        </div>
                    ) : (
                        <DropDown.Header className={dropDownHeaderClasses}>
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
