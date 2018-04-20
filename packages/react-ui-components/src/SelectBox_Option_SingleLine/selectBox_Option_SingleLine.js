/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ListPreviewElement from '../ListPreviewElement/index';
import mergeClassNames from 'classnames';

export default class SelectBox_Option_SingleLine extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            disabled: PropTypes.bool
        }).isRequired,

        disabled: PropTypes.bool,

        className: PropTypes.string
    };

    render() {
        const {option, className, disabled} = this.props;

        const finalClassNames = mergeClassNames({
            [className]: className
        });

        return (
            <ListPreviewElement {...this.props} icon={option.icon} disabled={disabled} className={finalClassNames}>
                <span>{option.label}</span>
            </ListPreviewElement>
        );
    }
}
