import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DropDown from '../DropDown/index';
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
                __value: PropTypes.any.isRequired,
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired,
                icon: PropTypes.string,
                group: PropTypes.string
            })
        ),

        previewRenderer: PropTypes.func.isRequired,

        /**
         * This prop represents the current selected value.
         */
        selectedValue: PropTypes.string,

        onChange: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        IconComponent: PropTypes.any.isRequired,
        TextInputComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired
    };

    state = {
        isOpen: false,
        selectedIndex: -1
    };

    handleChange = newValue => {
        this.setState({isOpen: false});
        this.props.onChange(newValue);
    }

    wrappedPreviewRenderer = (item, index) => {
        return this.props.previewRenderer(this.handleChange, item, index);
    }

    handleDropdownToggle = () => {
        if (this.state.isOpen) {
            // reset selected index to not get falsy preselected values
            // if dropdown is opened more than once
            this.setState({
                isOpen: false,
                selectedIndex: -1
            });
        } else {
            this.setState({
                isOpen: true
            });
        }
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
                    { optionsList.map(this.wrappedPreviewRenderer) }
                </ul>
            </li>
        );
    }

    render() {
        const {
            options,
            selectedValue,
            theme,
            IconComponent
        } = this.props;

        const {isOpen} = this.state;

        const selectedOption = options.find(option => option.__value === selectedValue);
        const loading = selectedValue && !selectedOption;

        const groupedOptions = this.getGroupedOptions(options);

        const hasMultipleGroups = Object.keys(groupedOptions).length > 1 || (Object.keys(groupedOptions).length === 1 && !groupedOptions[this.withoutGroupLabel]);

        return (
            <DropDown.Stateless className={theme.selectBox} isOpen={isOpen} onToggle={this.handleDropdownToggle} onClose={this.handleClose}>
                <DropDown.Header className={theme.selectBox__btn} shouldKeepFocusState={false} showDropDownToggle={Boolean(options.length)}>
                    {!loading && selectedOption.icon && <IconComponent className={theme.selectBox__btnIcon} icon={selectedOption.icon}/>}
                    {!loading && selectedOption && <span className={theme.dropDown__itemLabel}>{selectedOption.label}</span>}
                </DropDown.Header>
                <DropDown.Contents className={theme.selectBox__contents} scrollable={true}>
                    {hasMultipleGroups ? // skip rendering of groups if there are none or only one group
                        Object.entries(groupedOptions).map(this.renderGroup) :
                        options.map(this.wrappedPreviewRenderer)}
                </DropDown.Contents>
            </DropDown.Stateless>
        );
    }
}
