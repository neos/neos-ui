/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

/**
 * **SelectBox_ListPreviewUngrouped is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview if the options do not contain group elements;
 * and inside MultiSelectBox_ListPreviewSortable (which, in turn, is inside MultiSelect).
 */
export default class SelectBox_ListPreviewUngrouped extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        options: PropTypes.arrayOf(
            PropTypes.shape({
            }),
        ),
        ListPreviewElement: PropTypes.any.isRequired,

        // API with SelectBox
        optionValueAccessor: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        focusedValue: PropTypes.string,
        onOptionFocus: PropTypes.func,
    }

    render() {
        const {
            options
        } = this.props;

        return options.map(this.renderOption);
    }

    renderOption = (option, index) => {
        const {
            ListPreviewElement,
            optionValueAccessor,
            focusedValue
        } = this.props;

        const isHighlighted = optionValueAccessor(option) === focusedValue;

        if (!ListPreviewElement) {
            throw new Error("Preview component was undefined in Selector");
        }

        return (
            <li key={index} role="option">
                <ListPreviewElement

                    isHighlighted={isHighlighted}
                    option={option}
                    onClick={this.handlePreviewElementClick(option)}
                    onMouseEnter={this.handlePreviewElementMouseEnter(option)}
                    />
            </li>
        );
    }

    handlePreviewElementClick = option => () => {
        this.props.onChange(option);
    }

    handlePreviewElementMouseEnter = option => () => {
        if (this.props.onOptionFocus) {
            this.props.onOptionFocus(option);
        }
    }
}
