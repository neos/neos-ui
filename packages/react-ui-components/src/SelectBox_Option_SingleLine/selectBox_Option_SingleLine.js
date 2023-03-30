/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement';
import mergeClassNames from 'classnames';

class SelectBox_Option_SingleLine extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            disabled: PropTypes.bool
        }).isRequired,

        disabled: PropTypes.bool,
        showIcon: PropTypes.bool,

        className: PropTypes.string
    }

    render() {
        const {option, className, disabled, showIcon, icon} = this.props;

        const isDisabled = disabled || option.disabled;

        const finalClassNames = mergeClassNames({
            [className]: className
        });

        // We want to show the icon of the option when it is defined
        // If we have no option icon but showIcon is true, we want to show the icon of the SelectBox
        // If we have no option icon and showIcon is false, we want to show no icon
        const visibleIcon = option.icon ? option.icon : (showIcon ? icon : null);

        return (
            <ListPreviewElement {...this.props} icon={visibleIcon} showIcon={showIcon || Boolean(visibleIcon)} disabled={isDisabled} className={finalClassNames}>
                <span title={option.label}>{option.label}</span>
            </ListPreviewElement>
        );
    }
}

export default SelectBox_Option_SingleLine;
