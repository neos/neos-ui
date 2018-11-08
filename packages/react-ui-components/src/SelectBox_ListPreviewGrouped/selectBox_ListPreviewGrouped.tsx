// tslint:disable:class-name
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';
import ListPreviewElement from '../ListPreviewElement';
import {SelectBox_ListPreviewGroup_Props, SelectOption, SelectOptions} from '../SelectBox_ListPreview/selectBox_ListPreview';

interface SelectOptionGroups {
    readonly [groupLabel: string]: SelectOptions;
}

export interface SelectBox_ListPreviewGrouped_Props extends SelectBox_ListPreviewGroup_Props {
    readonly withoutGroupLabel: string;
    readonly theme?: SelectBox_ListPreviewGrouped_Theme;
}

interface SelectBox_ListPreviewGrouped_Theme {
    readonly 'selectBox__item': string;
    readonly 'selectBox__item--isGroup': string;
    readonly 'selectBox__groupHeader': string;
}

/**
 * **SelectBox_ListPreviewUngrouped is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview if the options do not contain group elements;
 * and inside MultiSelectBox_ListPreviewSortable (which, in turn, is inside MultiSelect).
 */
export default class SelectBox_ListPreviewGrouped extends PureComponent<SelectBox_ListPreviewGrouped_Props> {
    // tslint:disable-next-line:readonly-keyword
    private focusedElement?: HTMLLIElement;

    public render(): ReadonlyArray<JSX.Element> {
        const {
            options
        } = this.props;

        // tslint:disable-next-line:no-object-mutation
        this.focusedElement = undefined;

        const groupedOptions = this.getGroupedOptions(options);

        return Object.entries(groupedOptions).map(this.renderGroup);
    }

    // Scroll the sidebar if needed
    public componentDidUpdate(): void {
        if (this.focusedElement) {
            const rect = this.focusedElement.getBoundingClientRect();
            if (rect.bottom >= window.innerHeight) {
                this.focusedElement.scrollIntoView();
            }
        }
    }

    /**
     * Groups the options of the selectBox by their group-attribute. Returns a javascript Map with the group names
     * as key and an array of options as values.
     * Options without a group-attribute assigned will receive the key specified in props.withoutGroupLabel.
     */
    private readonly getGroupedOptions = (options: SelectOptions): SelectOptionGroups => {
        return options.reduce((selectOptionGroups, currentOption) => {
            const groupLabel = currentOption.group ? currentOption.group : this.props.withoutGroupLabel;
            const optionGroup = selectOptionGroups[groupLabel] || [];

            return {
                ...selectOptionGroups,
                [groupLabel]: optionGroup.concat(currentOption),
            };
        }, {} as SelectOptionGroups); // <-- Initial value of the accumulator
    }

    /**
     * Renders the options of the selectBox as <li> and groups them below a <span>
     * that displays their group name.
     * @returns {JSX} option elements grouped by and labeled with their group-attribute.
     */
    private readonly renderGroup = (optionsEntry: [string, SelectOptions]): JSX.Element => {
        const [groupLabel, optionsList] = optionsEntry;
        const {theme} = this.props;
        const groupClassName = mergeClassNames(
            theme!.selectBox__item,
            theme!['selectBox__item--isGroup'],
        );

        return (
            <li key={groupLabel} className={groupClassName}>
                <div className={theme!.selectBox__groupHeader}>
                    {groupLabel}
                </div>
                <ul>
                    {optionsList.map(this.renderOption)}
                </ul>
            </li>
        );
    }

    private readonly renderOption = (option: SelectOption, index: number) => {
        const {
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
                    if (ref && isHighlighted) {
                        // tslint:disable-next-line:no-object-mutation
                        this.focusedElement = ref;
                    }
                }}
                role="option"
                aria-selected={isHighlighted ? 'true' : 'false'}
                className={theme!.selectBox__item}
            >
                <ListPreviewElement
                    isHighlighted={isHighlighted}
                    onClick={this.handlePreviewElementClick(option)}
                    onMouseEnter={this.handlePreviewElementMouseEnter(option)}
                />
            </li>
        );
    }

    private readonly handlePreviewElementClick = (option: SelectOption) => () => {
        this.props.onChange(option);
    }

    private readonly handlePreviewElementMouseEnter = (option: SelectOption) => () => {
        if (this.props.onOptionFocus) {
            this.props.onOptionFocus(option);
        }
    }
}
