/* eslint-disable camelcase, react/jsx-pascal-case */
import React from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement/index';
import mergeClassNames from 'classnames';

const SelectBox_Option_SingleLine = props => {
    const {option, className, disabled} = props;

    const isDisabled = disabled || option.disabled;

    const finalClassNames = mergeClassNames({
        [className]: className
    });

    return (
        <ListPreviewElement {...props} icon={option.icon} disabled={isDisabled} className={finalClassNames}>
            <span>{option.label}</span>
        </ListPreviewElement>
    );
};
SelectBox_Option_SingleLine.propTypes = {
    option: PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        disabled: PropTypes.bool
    }).isRequired,

    disabled: PropTypes.bool,

    className: PropTypes.string
};

export default SelectBox_Option_SingleLine;
