/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement';
import mergeClassNames from 'classnames';
import style from './style.module.css';

class SelectBox_Option_SingleLine extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            disabled: PropTypes.bool,
            title: PropTypes.string
        }).isRequired,

        disabled: PropTypes.bool,

        className: PropTypes.string,

        icon: PropTypes.string,

        linkOptions: PropTypes.shape({
            href: PropTypes.string.isRequired,
            target: PropTypes.string,
            rel: PropTypes.string,
            onClick: PropTypes.func
        })
    }

    render() {
        const {option, className, disabled, icon, linkOptions} = this.props;

        const isDisabled = disabled || option.disabled;

        const finalClassNames = mergeClassNames({
            [className]: className,
            [style.linkedItem]: linkOptions
        });
        const linkClassname = mergeClassNames({
            [style.dropdownLink]: true,
            [style.hasIcon]: (Boolean(option.icon || icon))
        });

        const previewElementIcon = option.icon ? option.icon : (icon ? icon : null);

        return (
            <ListPreviewElement {...this.props} icon={previewElementIcon} disabled={isDisabled} className={finalClassNames}>
                {linkOptions ? (
                    <a
                        {...linkOptions}
                        className={linkClassname}
                        title={option.title ? option.title : option.label}>{option.label}</a>
                ) : (
                    <span title={option.title ? option.title : option.label}>{option.label}</span>
                )}
            </ListPreviewElement>
        );
    }
}

export default SelectBox_Option_SingleLine;
