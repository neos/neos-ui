// tslint:disable:class-name
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import ListPreviewElement from '../ListPreviewElement';
import {ListPreviewElementProps} from '../ListPreviewElement/listPreviewElement';

export interface SelectBox_Option_SingleLineProps extends Partial<ListPreviewElementProps> {
    readonly option: Options;
    readonly disabled?: boolean;
    readonly className?: string;
}

interface Options {
    readonly label: string;
    readonly icon?: string;
    readonly disabled?: boolean;
}

export default class SelectBox_Option_SingleLine extends PureComponent<SelectBox_Option_SingleLineProps> {
    public render(): JSX.Element {
        const {option, className, disabled, ...rest} = this.props;

        const isDisabled = disabled || option.disabled;

        const finalClassNames = mergeClassNames(className);

        return (
            <ListPreviewElement {...rest} icon={option.icon} disabled={isDisabled} className={finalClassNames}>
                <span>{option.label}</span>
            </ListPreviewElement>
        );
    }
}
