// tslint:disable:class-name
import React, {PureComponent} from 'react';
import ListPreviewElement from '../ListPreviewElement';
import {SelectBox_ListPreviewGroup_Props} from '../SelectBox_ListPreview/selectBox_ListPreview';
import {SelectBoxOption} from '../SelectBox/selectBox';

export interface SelectBox_ListPreviewFlat_Props extends SelectBox_ListPreviewGroup_Props {
    readonly theme: SelectBox_ListPreviewFlat_Theme;
}

interface SelectBox_ListPreviewFlat_Theme {
    readonly selectBox__item: string;
}

/**
 * **SelectBox_ListPreviewFlat is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox_ListPreview if the options do not contain group elements;
 * and inside MultiSelectBox_ListPreviewSortable (which, in turn, is inside MultiSelect).
 */
export default class SelectBox_ListPreviewFlat extends PureComponent<SelectBox_ListPreviewFlat_Props> {
    // tslint:disable-next-line:readonly-keyword
    private focusedElement?: HTMLLIElement;

    public render(): ReadonlyArray<JSX.Element> {
        const {
            options
        } = this.props;

        // tslint:disable-next-line:no-object-mutation
        this.focusedElement = undefined;

        return options.map(this.renderOption);
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

    private readonly renderOption = (option: SelectBoxOption, index: number) => {
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
                    if (ref !== null && isHighlighted) {
                        // tslint:disable-next-line:no-object-mutation
                        this.focusedElement = ref;
                    }
                }}
                role="option"
                aria-selected={isHighlighted ? 'true' : 'false'}
                className={theme!.selectBox__item}
            >
                <ListPreviewElement
                    icon={option.icon}
                    disabled={option.disabled}
                    isHighlighted={isHighlighted}
                    onClick={this.handlePreviewElementClick(option)}
                    onMouseEnter={this.handlePreviewElementMouseEnter(option)}
                >{option.label}</ListPreviewElement>
            </li>
        );
    }

    private readonly handlePreviewElementClick = (option: SelectBoxOption) => () => {
        this.props.onChange(option);
    }

    private readonly handlePreviewElementMouseEnter = (option: SelectBoxOption) => () => {
        if (this.props.onOptionFocus) {
            this.props.onOptionFocus(option);
        }
    }
}
