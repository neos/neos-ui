import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export default class SelectBox_ListPreviewUngrouped extends PureComponent {
    static propTypes = {
        // the options to display in the list
        options: PropTypes.arrayOf(
            PropTypes.shape({
            }),
        ),
        optionValueAccessor: PropTypes.func.isRequired,

        // called with the "option" object which has been chosen
        onChange: PropTypes.func.isRequired,

        // Focus handling
        focusedValue: PropTypes.string,
        onOptionFocus: PropTypes.func,

        // component class to be used for rendering the individual items.
        // Fits well together with ListPreviewElement.
        ListPreviewElement: PropTypes.any.isRequired,
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
            focusedValue,
            optionValueAccessor
        } = this.props;

        const isHighlighted = optionValueAccessor(option) === focusedValue;

        if (!ListPreviewElement) {
            throw new Error("Preview component was undefined in Selector");
        }

        return (
            <li key={index}>
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
