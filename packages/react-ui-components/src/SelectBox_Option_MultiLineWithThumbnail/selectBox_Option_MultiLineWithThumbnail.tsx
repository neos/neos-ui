/* eslint-disable camelcase, react/jsx-pascal-case */
import mergeClassNames from 'classnames';
// tslint:disable:class-name
import React, {PureComponent} from 'react';

import ListPreviewElement from '../ListPreviewElement';

interface SelectBox_Option_MultiLineWithThumbnail_Props {
    readonly label: string;
    readonly secondaryLabel?: string;
    readonly tertiaryLabel?: string;
    readonly imageUri?: string;
    readonly icon?: string;
    readonly className?: string;
    readonly theme?: SelectBox_Option_MultiLineWithThumbnail_Theme;
}

interface SelectBox_Option_MultiLineWithThumbnail_Theme {
    readonly multiLineWithThumbnail__item: string;
    readonly multiLineWithThumbnail__secondaryLabel: string;
    readonly multiLineWithThumbnail__tertiaryLabel: string;
    readonly multiLineWithThumbnail__image: string;
}

export default class SelectBox_Option_MultiLineWithThumbnail extends PureComponent<SelectBox_Option_MultiLineWithThumbnail_Props> {
    public render(): JSX.Element {
        const {
            label,
            secondaryLabel,
            tertiaryLabel,
            imageUri,
            icon,
            className,
            theme,
            ...rest
        } = this.props;

        const finalClassNames = mergeClassNames(
            theme!.multiLineWithThumbnail__item,
            className,
        );

        return (
            <ListPreviewElement {...rest} icon={icon} className={finalClassNames}>
                {Boolean(imageUri) && <img src={imageUri} alt={label} className={theme!.multiLineWithThumbnail__image}/>}
                <span>{label}</span>
                {Boolean(secondaryLabel) && <span className={theme!.multiLineWithThumbnail__secondaryLabel}>{secondaryLabel}</span>}
                {Boolean(tertiaryLabel) && <span className={theme!.multiLineWithThumbnail__tertiaryLabel}>{tertiaryLabel}</span>}
            </ListPreviewElement>
        );
    }
}
