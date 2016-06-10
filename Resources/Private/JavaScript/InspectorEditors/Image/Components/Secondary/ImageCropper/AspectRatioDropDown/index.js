import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {Maybe} from 'monet';

import {Components} from '@host';

import {AspectRatioOption, NullAspectRatioStrategy} from '../model';

import style from './style.css';

const {Icon, DropDown} = Components;

export default class AspectRatioDropDown extends Component {
    static propTypes = {
        current: PropTypes.instanceOf(NullAspectRatioStrategy),
        options: PropTypes.arrayOf(
            PropTypes.instanceOf(AspectRatioOption)
        ),
        placeholder: PropTypes.string
    };

    render() {
        const {options, current, placeholder, onSelect} = this.props;

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    {Maybe.fromNull(current).map(
                        current => (
                            <DropDown.Header className={style.dropDown__btn}>
                                {current.label}
                            </DropDown.Header>
                        )
                    ).orSome(
                        <DropDown.Header className={style.dropDown__btn}>
                            {placeholder}
                        </DropDown.Header>
                    )}

                    <DropDown.Contents className={style.dropDown__contents}>
                        {options.map(aspectRatioOption => (
                            <li
                                className={style.dropDown__item} onClick={() => onSelect(aspectRatioOption)}
                                >
                                {aspectRatioOption.label}
                            </li>
                        ))}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
