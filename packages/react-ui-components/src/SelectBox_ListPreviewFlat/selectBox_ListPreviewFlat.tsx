// tslint:disable:class-name
import React, {PureComponent} from 'react';

type Option = any; // TODO: what is the type of an option?

interface SelectBox_ListPreviewFlat_Props {
    // For explanations of the PropTypes, see SelectBox.js
    readonly options: ReadonlyArray<{
        readonly [key: string]: any;
    }>;
    readonly ListPreviewElement: any; // TODO type interface

    // API with SelectBox
    readonly optionValueAccessor: (option: Option) => string | undefined;
    readonly onChange: (option: Option) => void;
    readonly focusedValue?: string;
    readonly onOptionFocus?: (option: Option) => void;

    // ------------------------------
    // Theme & Dependencies
    // ------------------------------
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
                    if (ref !== null && isHighlighted) {
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
