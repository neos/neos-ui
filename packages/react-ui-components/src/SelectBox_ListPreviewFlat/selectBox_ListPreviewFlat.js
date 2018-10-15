/* eslint-disable camelcase, react/jsx-pascal-case, react/jsx-no-bind */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

/**
 * **SelectBox_ListPreviewFlat is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview if the options do not contain group elements;
 * and inside MultiSelectBox_ListPreviewSortable (which, in turn, is inside MultiSelect).
 */
export default class SelectBox_ListPreviewFlat extends PureComponent {
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

        // ------------------------------
        // Theme & Dependencies
        // ------------------------------
        theme: PropTypes.shape({
            selectBox__item: PropTypes.string
        }).isRequired
    }

    // Scroll the sidebar if needed
    componentDidUpdate() {
        if (this.focusedElement !== null) {
            const rect = this.focusedElement.getBoundingClientRect();
            if (rect.bottom >= window.innerHeight) {
                this.focusedElement.scrollIntoView();
            }
        }
    }

    render() {
        const {
            options
        } = this.props;

        this.focusedElement = null;

        return options.map(this.renderOption);
    }

    renderOption = (option, index) => {
        const {
            ListPreviewElement,
            optionValueAccessor,
            focusedValue,
            theme
        } = this.props;

        const isHighlighted = optionValueAccessor(option) === focusedValue;

        if (!ListPreviewElement) {
            throw new Error('Preview component was undefined in Selector');
        }

        return (
            <li
                key={index}
                ref={ref => {
                    if (ref !== null && isHighlighted) {
                        this.focusedElement = ref;
                    }
                }}
                role="option"
                aria-selected={isHighlighted ? 'true' : 'false'}
                className={theme.selectBox__item}
                >
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
