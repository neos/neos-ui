import React, {Component, PropTypes} from '@host/react';
import {Maybe} from 'monet';

import {Components} from '@host';

import {AspectRatioOption, NullAspectRatioStrategy} from '../model';

import style from './style.css';

const {IconButton, DropDown} = Components;

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

    render() {
        const {options, current, placeholder, onSelect, onClear} = this.props;

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    {Maybe.fromNull(current.label ? current : null).map(
                        current => (
                            <div stlye={{position: 'relative'}}>
                                <DropDown.Header className={style.dropDown__btn}>
                                    {current.label}
                                </DropDown.Header>
                                <IconButton icon="times" onClick={() => onClear()} className={style.dropDown__clear}/>
                            </div>
                        )
                    ).orSome(
                        <DropDown.Header className={[
                            style.dropDown__btn,
                            style['dropDown__btn--isPlaceholder']
                        ].join(' ')}>
                            {placeholder}
                        </DropDown.Header>
                    )}
                    <DropDown.Contents className={style.dropDown__contents}>
                        {options.map(aspectRatioOption => (
                            <li className={style.dropDown__item} onClick={() => onSelect(aspectRatioOption)}>
                                {aspectRatioOption.label}
                            </li>
                        ))}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
