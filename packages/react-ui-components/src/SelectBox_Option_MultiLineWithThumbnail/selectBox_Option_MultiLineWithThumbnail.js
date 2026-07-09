/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement';
import mergeClassNames from 'classnames';

class SelectBox_Option_MultiLineWithThumbnail extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        secondaryLabel: PropTypes.string,
        tertiaryLabel: PropTypes.string,
        imageUri: PropTypes.string,
        icon: PropTypes.string,
        title: PropTypes.string,

        className: PropTypes.string,

        theme: PropTypes.shape({
            multiLineWithThumbnail__item: PropTypes.string.isRequired,
            'multiLineWithThumbnail__item--multiLine': PropTypes.string.isRequired,
            'multiLineWithThumbnail__item--withIcon': PropTypes.string.isRequired,
            multiLineWithThumbnail__label: PropTypes.string.isRequired,
            multiLineWithThumbnail__secondaryLabel: PropTypes.string.isRequired,
            multiLineWithThumbnail__tertiaryLabel: PropTypes.string.isRequired,
            multiLineWithThumbnail__image: PropTypes.string.isRequired
        }).isRequired
    }

    render() {
        const {
            label,
            secondaryLabel,
            tertiaryLabel,
            imageUri,
            title,
            icon,
            className,
            theme,
            ...rest
        } = this.props;

        const finalClassNames = mergeClassNames({
            [theme.multiLineWithThumbnail__item]: true,
            [theme['multiLineWithThumbnail__item--multiLine']]: secondaryLabel || tertiaryLabel,
            [theme['multiLineWithThumbnail__item--withIcon']]: icon,
            [className]: className
        });

        return (
            <ListPreviewElement {...rest} theme={theme} icon={icon} className={finalClassNames}>
                {Boolean(imageUri) && <img src={imageUri} alt={label} className={theme.multiLineWithThumbnail__image}/>}
                <span className={theme.multiLineWithThumbnail__label} title={title ? title : label}>{label}</span>
                {Boolean(secondaryLabel) && <span className={theme.multiLineWithThumbnail__secondaryLabel} title={secondaryLabel}>{secondaryLabel}</span>}
                {Boolean(tertiaryLabel) && <span className={theme.multiLineWithThumbnail__tertiaryLabel} title={tertiaryLabel}>{tertiaryLabel}</span>}
            </ListPreviewElement>
        );
    }
}

export default SelectBox_Option_MultiLineWithThumbnail;
