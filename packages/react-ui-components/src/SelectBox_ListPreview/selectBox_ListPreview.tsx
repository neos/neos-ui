// tslint:disable:class-name
import React, {Fragment, PureComponent} from 'react';

import SelectBox_CreateNew from '../SelectBox_CreateNew';
import SelectBox_ListPreviewFlat from '../SelectBox_ListPreviewFlat';
import SelectBox_ListPreviewGrouped from '../SelectBox_ListPreviewGrouped';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';
import {SelectBoxOption, SelectBoxOptions, SelectBoxProps} from '../SelectBox/selectBox';
import {Omit} from '../../types';

export interface SelectBox_ListPreviewGroup_Props {
    readonly options: SelectBoxOptions;

    // API with SelectBox
    readonly optionValueAccessor: (option: SelectBoxOption) => string | undefined;
    readonly onChange: (option: SelectBoxOption) => void;
    readonly focusedValue?: string;
    readonly onOptionFocus: (option: SelectBoxOption) => void;
}

export interface SelectBox_ListPreview_Props extends Omit<SelectBoxProps, 'theme'>, SelectBox_ListPreviewGroup_Props {
    // Number of characters left to type before search
    readonly searchTermLeftToType: number;
    readonly noMatchesFound?: boolean;
    readonly searchBoxLeftToTypeLabel: string;
    readonly noMatchesFoundLabel: string;
    readonly theme?: SelectBox_ListPreview_Theme;
}

export interface SelectBox_ListPreview_Theme {
    readonly 'selectBox__item': string;
    readonly 'selectBox__item--isGroup': string;
    readonly 'selectBox__groupHeader': string;
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
                    theme={theme!}
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
                    theme={theme!}
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
