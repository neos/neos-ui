import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export default class Selector extends PureComponent {
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
        /**
         * This prop represents the current selected value.
         */
        value: PropTypes.string,
        optionValueAccessor: PropTypes.func.isRequired,

        // is the selector currently opened or closed?
        isExpanded: PropTypes.bool.isRequired,
        onToggleExpanded: PropTypes.func.isRequired,


        // TODO: must be a react component CLASS
        Preview: PropTypes.any.isRequired,


        // empty option list handling should happen inside here



        // TODO: must be a react component CLASS
        ActionRenderer: PropTypes.any,
        onAction: PropTypes.func,



        /**
         * The value the user has not yet selected, but has hovered over with his mouse.
         */
        focusedValue: PropTypes.string,

        onChange: PropTypes.func.isRequired,
        onOptionFocus: PropTypes.func.isRequired,

        theme: PropTypes.object.isRequired,
        DropDownComponent: PropTypes.any.isRequired,
        IconComponent: PropTypes.any.isRequired,
    };

    handleChange = newValue => {
        this.props.onChange(newValue);
    }

    handleClose = () => {

    }

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
                    { optionsList.map(this.renderOption) }
                </ul>
            </li>
        );
    }

    render() {
        const {
            options,
            optionValueAccessor,
            value,
            theme,
            DropDownComponent,
            IconComponent,

            isExpanded,
            onToggleExpanded
        } = this.props;

        const selectedOption = value && options.find(option => optionValueAccessor(option) === value);

        const groupedOptions = this.getGroupedOptions(options);

        const hasMultipleGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions[this.withoutGroupLabel]);

        return (
            <DropDownComponent.Stateless className={theme.selectBox} isOpen={isExpanded} onToggle={onToggleExpanded} onClose={this.handleClose}>
                <DropDownComponent.Header className={theme.selectBox__btn} shouldKeepFocusState={false} showDropDownToggle={Boolean(options.length)}>
                    {Boolean(selectedOption) && selectedOption.icon && <IconComponent className={theme.selectBox__btnIcon} icon={selectedOption.icon}/>}
                    {Boolean(selectedOption) && <span className={theme.dropDown__itemLabel}>{selectedOption.label}</span>}
                </DropDownComponent.Header>
                <DropDownComponent.Contents className={theme.selectBox__contents} scrollable={true}>
                    {hasMultipleGroups ? // skip rendering of groups if there are none or only one group
                        Object.entries(groupedOptions).map(this.renderGroup) :
                        options.map(this.renderOption)}
                </DropDownComponent.Contents>
            </DropDownComponent.Stateless>
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
