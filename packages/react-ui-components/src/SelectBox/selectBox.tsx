/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {PureComponent, ReactElement} from 'react';
import {$get} from 'plow-js';
import mergeClassNames from 'classnames';
import {isEqual} from 'lodash';

import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';
import {PickDefaultProps} from '../../types';
import {ListPreviewElementProps} from '../ListPreviewElement/listPreviewElement';

import DropDown from '../DropDown';
import SelectBox_ListPreview from '../SelectBox_ListPreview';
import SelectBox_HeaderWithSearchInput from '../SelectBox_HeaderWithSearchInput';
import SelectBox_Header from '../SelectBox_Header';
import {SelectBox_ListPreview_Theme} from '../SelectBox_ListPreview/selectBox_ListPreview';
import {SelectBox_Header_Theme} from '../SelectBox_Header/selectBox_Header';
import {SelectBox_HeaderWithSearchInput_Theme} from '../SelectBox_HeaderWithSearchInput/selectBox_HeaderWithSearchInput';

export type SelectBoxOption = Readonly<{
    label: string | ReactElement<any>;
    icon?: string;
    disabled?: boolean;
    group?: string;
    [key: string]: any;
}>;

export type SelectBoxOptions = ReadonlyArray<SelectBoxOption>;

interface SelectBoxTheme extends SelectBox_ListPreview_Theme, SelectBox_Header_Theme, SelectBox_HeaderWithSearchInput_Theme {
    readonly 'selectBox': string;
    readonly 'selectBox--disabled': string;
    readonly 'selectBox__btn': string;
    readonly 'selectBox__btn--noRightPadding': string;
    readonly 'selectBox__contents': string;
    readonly 'selectBox__list': string;
    readonly 'wrapper': string;
    readonly 'wrapper--highlight': string;
}

export interface SelectBoxProps {
    // ------------------------------
    // Basic Props for core functionality
    // ------------------------------
    /**
     * This prop represents the set of options to be chosen from
     * Each option must have a value and can have a label and an icon.
     */
    readonly options: SelectBoxOptions;

    /**
     * Additional className wich will be applied
     */
    readonly className?: string;

    /**
     * Field name specifying which field in a single "option" contains the "value"
     */
    readonly optionValueField: string;

    /**
     * This prop represents the currently selected value.
     */
    readonly value?: string;

    /**
     * This prop gets called when an option was selected. It returns the new value.
     */
    readonly onValueChange: (newValue: string) => void;

    /**
     * This prop controls if the SelectBox is disabled.
     */
    readonly disabled?: boolean;

    // ------------------------------
    // Visual customization of the Select Box
    // ------------------------------

    /**
     * This prop is the placeholder text which is displayed in the selectbox when no option was selected.
     */
    readonly placeholder: string;

    /**
     * This prop is an icon for the placeholder.
     */
    readonly placeholderIcon?: string;

    /**
     * Text for the group label of options without a group
     */
    readonly withoutGroupLabel: string;

    /**
     * If true, allows to clear the selected element completely (without choosing another one)
     */
    readonly allowEmpty?: boolean;

    /**
     * Shows dropdown toggle. Set by default. Useful in components that display search, where you don't want to let the user manually controll the collapsing of selectbox
     */
    readonly showDropDownToggle?: boolean;

    /**
     * Limit height and show scrollbars if needed, defaults to true
     */
    readonly scrollable?: boolean;

    /**
     * Component used for rendering the individual option elements; Usually this component uses "ListPreviewElement" internally for common styling.
     */
    readonly ListPreviewElement?: React.ComponentClass<ListPreviewElementProps & any>; // TODO maybe enhance ListPreviewElementProps with an index signature ([key: string]: any)

    // ------------------------------
    // Asynchronous loading of data
    // ------------------------------

    /**
     * This prop is the loading text which is displayed in the selectbox when displayLoadingIndicator ist set to true.
     */
    readonly loadingLabel?: string;

    /**
     * Helper for asynchronous loading; should be set to "true" as long as "options" is not yet populated.
     */
    readonly displayLoadingIndicator: boolean;

    // ------------------------------
    // Search-As-You-Type related functionality
    // ------------------------------
    readonly displaySearchBox: boolean;
    readonly onSearchTermChange: (searchTerm: string) => void;
    readonly onSearchTermKeyPress: (event: KeyboardEvent) => void;
    readonly threshold: number;
    readonly searchTerm?: string;
    readonly searchBoxLeftToTypeLabel: string;
    readonly noMatchesFoundLabel: string;

    /**
     * Turn SelectBox into a plain input field: not showing any search results and always showing the search input. Useful in LinkEditor to be able to input links by hand.
     */
    readonly plainInputMode?: boolean;

    /**
     * If set to true, the search box is directly focussed once the SelectBox is rendered;
     * such that the user can start typing right away.
     */
    readonly setFocus?: boolean;

    // ------------------------------
    // "Create new if not exists" functionality
    // ------------------------------
    /**
     * This prop gets called when requested to create a new element
     */
    readonly onCreateNew: (value: string) => void;

    /**
     * "Create new" label
     */
    readonly createNewLabel: string;

    // ------------------------------
    // Theme & Dependencies
    // ------------------------------
    readonly theme?: SelectBoxTheme;

    /**
     * keydown // TODO comes from keydown enhancement, so maybe use decorator/enhancer
     */
    readonly keydown: {event?: KeyboardEvent};
}

type SelectBoxDefaultProps = PickDefaultProps<SelectBoxProps,
    'options' |
    'optionValueField' |
    'withoutGroupLabel' |
    'scrollable' |
    'showDropDownToggle' |
    'threshold' |
    'ListPreviewElement'
>;

export const defaultProps: SelectBoxDefaultProps = {
    options: [],
    optionValueField: 'value',
    withoutGroupLabel: 'Without group',
    scrollable: true,
    showDropDownToggle: true,
    threshold: 2,
    ListPreviewElement: SelectBox_Option_SingleLine,
};

interface SelectBoxState {
    readonly searchTerm: string;
    readonly isExpanded: boolean;
    readonly focusedValue: string;
}

const initialState: SelectBoxState = {
    searchTerm: '',
    isExpanded: false,
    focusedValue: '',
};

// TODO: document component usage && check code in detail
export default class SelectBox extends PureComponent<SelectBoxProps, SelectBoxState> {
    public static readonly defaultProps = defaultProps;

    public readonly state = initialState;

    public render(): JSX.Element {
        const {
            options,
            theme,
            showDropDownToggle,
            threshold,
            displaySearchBox,
            displayLoadingIndicator,
            ListPreviewElement,
            plainInputMode,
            disabled,
            className,
        } = this.props;

        const searchTerm = this.getSearchTerm();

        const {focusedValue} = this.state;
        const isExpanded = disabled ? false : this.state.isExpanded;

        const headerClassName = mergeClassNames(
            className,
            theme!.selectBox__btn,
            {
                [theme!['selectBox__btn--noRightPadding']]: !showDropDownToggle,
                [theme!['selectBox--disabled']]: disabled
            }
        );

        const optionValueAccessor = this.getOptionValueAccessor();

        const searchTermLeftToType = displaySearchBox ? threshold - searchTerm.length : 0;
        const noMatchesFound = searchTermLeftToType > 0 || displayLoadingIndicator ? false : !options.length;

        return (
            <DropDown.Stateless className={theme!.selectBox} isOpen={isExpanded} onToggle={this.handleToggleExpanded} onClose={this.handleClose}>
                <DropDown.Header className={headerClassName} shouldKeepFocusState={false} showDropDownToggle={showDropDownToggle && options.length > 0}>
                    {this.renderHeader()}
                </DropDown.Header>
                <DropDown.Contents className={theme!.selectBox__contents} scrollable={true}>
                    {!plainInputMode &&
                        <ul className={theme!.selectBox__list}>
                            <SelectBox_ListPreview
                                {...this.props}

                                theme={theme}
                                optionValueAccessor={optionValueAccessor}
                                ListPreviewElement={ListPreviewElement}
                                focusedValue={focusedValue}
                                onChange={this.handleChange}
                                onOptionFocus={this.handleOptionFocusChange}
                                searchTermLeftToType={searchTermLeftToType}
                                noMatchesFound={noMatchesFound}
                                searchTerm={searchTerm}
                            />
                        </ul>}
                </DropDown.Contents>
            </DropDown.Stateless>
        );
    }

    private getSearchTerm(): string {
        return this.props.searchTerm || this.state.searchTerm;
    }

    private getOptionValueAccessor(): (option: SelectBoxOption) => string {
        // returns a function that extract a value from the object
        // TODO extend $get path to return a curried function if called with _path_ arg only
        // @ts-ignore
        return $get([this.props.optionValueField]);
    }

    private renderHeader(): JSX.Element {
        const {
            displaySearchBox,
            displayLoadingIndicator,
            options,
            value,
            allowEmpty,
            plainInputMode,
            disabled,
        } = this.props;
        const searchTerm = this.getSearchTerm();
        const optionValueAccessor = this.getOptionValueAccessor();

        // Compare selected value less strictly: allow loose comparision and deep equality of objects
        // tslint:disable-next-line:triple-equals
        const selectedOption = options.find(option => optionValueAccessor(option) == value || isEqual(optionValueAccessor(option), value));

        if (displaySearchBox && (!value || plainInputMode)) {
            return (
                <SelectBox_HeaderWithSearchInput
                    {...this.props}
                    disabled={disabled}
                    onSearchTermChange={this.handleSearchTermChange}
                    searchTerm={searchTerm}
                    onKeyDown={this.handleKeyDown}
                />
            );
        }

        const showResetButton = Boolean(allowEmpty && !displayLoadingIndicator && value);

        return (
            <SelectBox_Header
                {...this.props}
                option={selectedOption}
                showResetButton={showResetButton}
                onReset={this.handleDeleteClick}
            />
        );
    }

    private readonly handleChange = (option: SelectBoxOption) => {
        const optionValueAccessor = this.getOptionValueAccessor();
        this.props.onValueChange(optionValueAccessor(option));
        this.setState({
            searchTerm: ''
        });
    }

    private readonly handleDeleteClick = (event?: MouseEvent) => {
        if (event) {
            // Don't open SelectBox on value clear
            event.stopPropagation();
        }
        this.props.onValueChange('');
    }

    private readonly handleToggleExpanded = () => {
        // Return early if disabled
        if (this.props.disabled) {
            return;
        }

        if (this.props.displaySearchBox) {
            if (this.props.value) {
                // When click on header in search mode with value selected, clear it
                this.props.onValueChange('');
                this.setState({
                    isExpanded: true,
                });
            } else {
                // Force expanded dropdown unless has showDropDownToggle (e.g. for nodetypes filter in the PageTree)
                this.setState({
                    isExpanded: this.props.showDropDownToggle ? !this.state.isExpanded : true,
                });
            }
        } else {
            // If simple SelectBox, just toggle it
            this.setState({
                isExpanded: !this.state.isExpanded,
            });
        }
    }

    private readonly handleClose = () => {
        this.setState({
            isExpanded: false
        });
    }

    private readonly handleOptionFocusChange = (option: SelectBoxOption) => {
        const optionValueAccessor = this.getOptionValueAccessor();
        this.setState({
            focusedValue: optionValueAccessor(option)
        });
    }

    private readonly handleSearchTermChange = (searchTerm: string) => {
        if (searchTerm.length >= this.props.threshold) {
            this.props.onSearchTermChange(searchTerm);
        } else {
            this.props.onSearchTermChange('');
        }
        this.setState({
            isExpanded: Boolean(searchTerm),
            searchTerm
        });
        this.props.onSearchTermChange(searchTerm);
    }

    /**
     * Keyboard handling
     */
    public componentWillReceiveProps({keydown}: SelectBoxProps): void {
        if (keydown.event) {
            this.handleKeyDown(keydown.event);
        }
    }

    private readonly handleKeyDown = (e: KeyboardEvent) => {
        const {options, onSearchTermKeyPress} = this.props;
        if (typeof onSearchTermKeyPress === 'function') {
            // Pass through keydown event, needed for keyboard handling
            onSearchTermKeyPress(e);
        }
        if (this.state.isExpanded && e && ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
            // Do not scroll while we are doing keyboard interaction
            e.preventDefault();

            const optionValueAccessor = this.getOptionValueAccessor();
            const currentIndex = options.findIndex(option => optionValueAccessor(option) === this.state.focusedValue);

            if (e.key === 'ArrowDown') {
                const newIndex = currentIndex + 1 >= options.length ? currentIndex : currentIndex + 1;
                this.setState({
                    focusedValue: optionValueAccessor(options[newIndex])
                });
            } else if (e.key === 'ArrowUp') {
                const newIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1;
                this.setState({
                    focusedValue: optionValueAccessor(options[newIndex])
                });
            } else if (e.key === 'Enter') {
                if (currentIndex < options.length && currentIndex >= 0) {
                    this.handleChange(options[currentIndex]);
                }

                this.setState({
                    isExpanded: false
                });
            } else if (e.key === 'Escape') {
                this.setState({
                    focusedValue: '',
                    isExpanded: false
                });
            }
        }
    }
}
