import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DropDown from '../DropDown/index';
import mergeClassNames from 'classnames';

export default class GroupedPreviewList extends PureComponent {
    static withoutGroupLabel = '---';

    static propTypes = {
        /**
         * This prop represents a set of options.
         * Each option must have a value and can have a label and an icon.
         */
        options: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired,
                icon: PropTypes.string,
                group: PropTypes.string
            })
        ),

        optionValueAccessor: PropTypes.func.isRequired,

        // TODO: must be a react component CLASS
        Preview: PropTypes.any.isRequired,

        // empty option list handling should happen inside here

        /**
         * The value the user has not yet selected, but has hovered over with his mouse.
         */
        focusedValue: PropTypes.string,

        onChange: PropTypes.func.isRequired,
        onOptionFocus: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired
    };

    /**
     * Groups the options of the selectBox by their group-attribute. Returns a javascript Map with the group names
     * as key and an array of options as values.
     * Options without a group-attribute assigned will receive the key specified in props.withoutGroupLabel.
     */
    getGroupedOptions = options => {
        return options.reduce((accumulator, currentOpt) => {
            const groupLabel = currentOpt.group ? currentOpt.group : this.withoutGroupLabel;
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
            <li
                key={groupLabel}
                className={groupClassName}
                >
                <span>
                    {groupLabel}
                </span>
                <ul>
                    {optionsList.map(this.renderOption) }
                </ul>
            </li>
        );
    }

    handleNoop = () => {

    }

    render() {
        const {
            options,
            theme
        } = this.props;

        const groupedOptions = this.getGroupedOptions(options);
        const hasMultipleGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions[this.withoutGroupLabel]);

        // TODO: Should be refactored and re-used in Selector
        return (
            <DropDown.Stateless className={theme.selectBox} isOpen={true} onToggle={this.handleNoop} onClose={this.handleNoop}>
                <DropDown.Contents className={theme.selectBox__contents} scrollable={true}>
                    {hasMultipleGroups ? // skip rendering of groups if there are none or only one group
                        Object.entries(groupedOptions).map(this.renderGroup) :
                        options.map(this.renderOption)}
                </DropDown.Contents>
            </DropDown.Stateless>
        );
    }

    renderOption = (option, index) => {
        const {
            Preview,
            focusedValue,
            optionValueAccessor
        } = this.props;

        const isHighlighted = optionValueAccessor(option) === focusedValue;

        if (!Preview) {
            throw new Error("Preview component was undefined in Selector");
        }

        return (
            <Preview
                key={index}
                isHighlighted={isHighlighted}
                option={option}
                onClick={this.handlePreviewClick(option)}
                onMouseEnter={this.handlePreviewMouseEnter(option)}
                />
        );
    }

    handlePreviewClick = option => () => {
        this.props.onChange(option);
    }

    handlePreviewMouseEnter = option => () => {
        this.props.onOptionFocus(option);
    }
}
