/* eslint-disable camelcase, react/jsx-pascal-case, react/jsx-no-bind */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

/**
 * **SelectBox_ListPreviewUngrouped is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview if the options do not contain group elements;
 * and inside MultiSelectBox_ListPreviewSortable (which, in turn, is inside MultiSelect).
 */
export default class SelectBox_ListPreviewGrouped extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        options: PropTypes.arrayOf(
            PropTypes.shape({
            }),
        ),
        ListPreviewElement: PropTypes.any.isRequired,

        theme: PropTypes.shape({
            'selectBox__item': PropTypes.string,
            'selectBox__item--isGroup': PropTypes.string,
            'selectBox__groupHeader': PropTypes.string
        }),

        // API with SelectBox
        optionValueAccessor: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        focusedValue: PropTypes.string,
        onOptionFocus: PropTypes.func,
        withoutGroupLabel: PropTypes.string.isRequired
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

        const groupedOptions = this.getGroupedOptions(options);

        return Object.entries(groupedOptions).map(this.renderGroup);
    }

    /**
     * Groups the options of the selectBox by their group-attribute. Returns a javascript Map with the group names
     * as key and an array of options as values.
     * Options without a group-attribute assigned will receive the key specified in props.withoutGroupLabel.
     */
    getGroupedOptions = options => {
        return options.reduce((accumulator, currentOpt) => {
            const groupLabel = currentOpt.group ? currentOpt.group : this.props.withoutGroupLabel;
            accumulator[groupLabel] = accumulator[groupLabel] || [];
            accumulator[groupLabel].push(currentOpt);
            return accumulator;
        }, Object.create(null)); // <-- Initial value of the accumulator
    }

    /**
     * Renders the options of the selectBox as <li> and groups them below a <span>
     * that displays their group name.
     * @returns {JSX} option elements grouped by and labeled with their group-attribute.
     */
    renderGroup = group => {
        const [groupLabel, optionsList] = group;
        const {theme} = this.props;
        const groupClassName = mergeClassNames({
            [theme.selectBox__item]: true,
            [theme['selectBox__item--isGroup']]: true
        });
        return (
            <li key={groupLabel} className={groupClassName}>
                <div className={theme.selectBox__groupHeader}>
                    {groupLabel}
                </div>
                <ul>
                    {optionsList.map(this.renderOption)}
                </ul>
            </li>
        );
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
