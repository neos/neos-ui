// tslint:disable:class-name
import React, {Fragment, PureComponent} from 'react';
import SelectBox_CreateNew from '../SelectBox_CreateNew';
import SelectBox_ListPreviewFlat from '../SelectBox_ListPreviewFlat';
import SelectBox_ListPreviewGrouped from '../SelectBox_ListPreviewGrouped';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';

export interface SelectOption {
    readonly icon?: string;
    readonly label?: string | object; // TODO object is not a good choice
    readonly disabled?: boolean;
    readonly group?: string;
    readonly [valueField: string]: any;
}

export interface SelectBox_ListPreviewElement_Props {
    readonly isHighlighted: boolean;
    readonly onClick: () => void;
    readonly onMouseEnter: () => void;
}

export interface SelectBox_ListPreviewGroup_Props {
    readonly options: SelectOptions;

    // API with SelectBox
    readonly optionValueAccessor: (option: SelectOption) => string | undefined;
    readonly onChange: (option: SelectOption) => void;
    readonly focusedValue: string;
    readonly onOptionFocus: (option: SelectOption) => void;
}

export type SelectOptions = ReadonlyArray<SelectOption>;

interface SelectBoxProps {
    readonly optionValueField: string;
    readonly searchTerm: string;
    readonly onSearchTermChange: (searchTerm: string) => void;
    readonly onCreateNew: (value: string) => void;
    readonly createNewLabel: string;
    readonly withoutGroupLabel: string;
}

interface SelectBox_ListPreview_Props extends SelectBoxProps, SelectBox_ListPreviewGroup_Props {
    readonly options: SelectOptions;
    // Number of characters left to type before search
    readonly searchTermLeftToType: number;
    readonly noMatchesFound?: boolean;
    readonly searchBoxLeftToTypeLabel?: string;
    readonly noMatchesFoundLabel: string;
    readonly theme?: SelectBox_ListPreview_Theme;
}

interface SelectBox_ListPreview_Theme {
    readonly selectBox__item: string;
}

/**
 * **SelectBox_ListPreview is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the dropdown part.
 */
class SelectBox_ListPreview extends PureComponent<SelectBox_ListPreview_Props> {
    public render(): JSX.Element {
        const {
            options,
            searchTermLeftToType,
            noMatchesFound,
            noMatchesFoundLabel,
            searchBoxLeftToTypeLabel,
            theme
        } = this.props;

        const ListPreviewComponent = options.some(option => option.group !== undefined) ?
            (
                <SelectBox_ListPreviewGrouped
                    options={options}
                    optionValueAccessor={this.props.optionValueAccessor}
                    onChange={this.props.onChange}
                    focusedValue={this.props.focusedValue}
                    onOptionFocus={this.props.onOptionFocus}

                    withoutGroupLabel={this.props.withoutGroupLabel}
                />
            ) :
            (
                <SelectBox_ListPreviewFlat
                    options={options}
                    optionValueAccessor={this.props.optionValueAccessor}
                    onChange={this.props.onChange}
                    focusedValue={this.props.focusedValue}
                    onOptionFocus={this.props.onOptionFocus}
                />
            );

        // TODO: replace horible self-made I18n replace
        return (
            <Fragment>
                {searchTermLeftToType > 0 ? (
                    <div className={theme!.selectBox__item}>
                        <SelectBox_Option_SingleLine
                            option={{label: `${searchBoxLeftToTypeLabel && searchBoxLeftToTypeLabel.replace('###CHARACTERS###', `${searchTermLeftToType}`)}`, icon: 'ellipsis-h'}}
                            key={'___leftToType'}
                            />
                    </div>
                ) : ListPreviewComponent}
                {noMatchesFound && (
                    <div className={theme!.selectBox__item}>
                        <SelectBox_Option_SingleLine
                            option={{label: noMatchesFoundLabel, icon: 'ban'}}
                            key={'___noResults'}
                            />
                    </div>
                )}
                <div className={theme!.selectBox__item}>
                    <SelectBox_CreateNew
                        optionValueField={this.props.optionValueField}
                        searchTerm={this.props.searchTerm}
                        onSearchTermChange={this.props.onSearchTermChange}
                        onCreateNew={this.props.onCreateNew}
                        createNewLabel={this.props.createNewLabel}
                        focusedValue={this.props.focusedValue}
                        onOptionFocus={this.props.onOptionFocus}
                    />
                </div>
            </Fragment>
        );
    }
}

export default SelectBox_ListPreview;
