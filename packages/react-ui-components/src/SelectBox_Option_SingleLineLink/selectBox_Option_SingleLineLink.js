/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement';
import mergeClassNames from 'classnames';

class SelectBox_Option_SingleLineLink extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            disabled: PropTypes.bool
        }).isRequired,

        disabled: PropTypes.bool,

        className: PropTypes.string
    }

    render() {
        const {option, className, disabled, icon, linkOptions} = this.props;

        const isDisabled = disabled || option.disabled;

        const finalClassNames = mergeClassNames({
            [className]: className
        });

        const previewElementIcon = option.icon ? option.icon : (icon ? icon : null);

        return (
            <ListPreviewElement {...this.props} icon={previewElementIcon} disabled={isDisabled} className={finalClassNames}>
                <a {...linkOptions} title={option.label}>{option.label}</a>
            </ListPreviewElement>
        );
    }
}

export default SelectBox_Option_SingleLineLink;
