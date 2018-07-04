/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement/index';
import mergeClassNames from 'classnames';

const SelectBox_Option_MultiLineWithThumbnail = props => {
    const {
        label,
        secondaryLabel,
        tertiaryLabel,
        imageUri,
        icon,
        className,
        theme,
        ...rest
    } = props;

    const finalClassNames = mergeClassNames({
        [theme.multiLineWithThumbnail__item]: true,
        [className]: className
    });

    return (
        <ListPreviewElement {...rest} icon={icon} className={finalClassNames}>
            {Boolean(imageUri) && <img src={imageUri} alt={label} className={theme.multiLineWithThumbnail__image}/>}
            <span>{label}</span>
            {Boolean(secondaryLabel) && <span className={theme.multiLineWithThumbnail__secondaryLabel}>{secondaryLabel}</span>}
            {Boolean(tertiaryLabel) && <span className={theme.multiLineWithThumbnail__tertiaryLabel}>{tertiaryLabel}</span>}
        </ListPreviewElement>
    );
};
SelectBox_Option_MultiLineWithThumbnail.propTypes = {
    label: PropTypes.string.isRequired,
    secondaryLabel: PropTypes.string,
    tertiaryLabel: PropTypes.string,
    imageUri: PropTypes.string,
    icon: PropTypes.string,

    className: PropTypes.string,

    theme: PropTypes.shape({
        multiLineWithThumbnail__item: PropTypes.string.isRequired,
        multiLineWithThumbnail__secondaryLabel: PropTypes.string.isRequired,
        multiLineWithThumbnail__tertiaryLabel: PropTypes.string.isRequired,
        multiLineWithThumbnail__image: PropTypes.string.isRequired
    }).isRequired
};

export default SelectBox_Option_MultiLineWithThumbnail;
