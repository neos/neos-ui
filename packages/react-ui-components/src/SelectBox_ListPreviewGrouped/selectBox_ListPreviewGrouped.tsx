// tslint:disable:class-name
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

// TODO hint: options prop should be a Map of all possible options

type Option = any; // TODO: what is the type of an option?

interface SelectBox_ListPreviewGrouped_Props {
    // For explanations of the PropTypes, see SelectBox.js
    readonly options: Options;
    readonly ListPreviewElement: any; // TODO: properly type this; should satisfy a certain interface

    readonly theme: SelectBox_ListPreviewGrouped_Theme;

    // API with SelectBox
    readonly optionValueAccessor: (option: Option) => string | undefined;
    readonly onChange: (option: Option) => void;
    readonly focusedValue?: string;
    readonly onOptionFocus?: (option: Option) => void;
    readonly withoutGroupLabel: string;
}

type Options = ReadonlyArray<{
    readonly group?: string;
    readonly [key: string]: Option;
}>; // TODO: what is actually in there?

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
    private readonly getGroupedOptions = (options: Options) => {
        return options.reduce((accumulator, currentOpt) => {
            const groupLabel = currentOpt.group ? currentOpt.group : this.props.withoutGroupLabel;
            // tslint:disable-next-line:no-object-mutation
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
    private readonly renderGroup = (group: ReadonlyArray<any>): JSX.Element => {
        const [groupLabel, optionsList] = group;
        const {theme} = this.props;
        const groupClassName = mergeClassNames(
            theme.selectBox__item,
            theme['selectBox__item--isGroup'],
        );

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

    private readonly renderOption = (option: Option, index: number) => {
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
                    if (ref && isHighlighted) {
                        // tslint:disable-next-line:no-object-mutation
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

    private readonly handlePreviewElementClick = (option: Option) => () => {
        this.props.onChange(option);
    }

    private readonly handlePreviewElementMouseEnter = (option: Option) => () => {
        if (this.props.onOptionFocus) {
            this.props.onOptionFocus(option);
        }
    }
}
