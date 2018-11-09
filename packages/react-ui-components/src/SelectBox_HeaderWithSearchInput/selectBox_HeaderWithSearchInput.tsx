// tslint:disable:class-name
import React, {PureComponent} from 'react';

import {PickDefaultProps} from '../../types';
import Icon from '../Icon';
import TextInput from '../TextInput';
import IconButton from '../IconButton';

interface SelectBox_HeaderWithSearchInput_Props {
    // For explanations of the PropTypes, see SelectBox.js
    readonly placeholder: string;
    readonly displayLoadingIndicator?: boolean;
    readonly searchTerm: string;
    readonly onSearchTermChange: (searchTerm: string) => void;
    readonly setFocus?: boolean;
    readonly disabled?: boolean;

    // For keyboard handling
    readonly onKeyDown: () => void;

    /* ------------------------------
     * Theme & Dependencies
     * ------------------------------ */
    readonly theme?: SelectBox_HeaderWithSearchInput_Theme;
}

interface SelectBox_HeaderWithSearchInput_Theme {
    readonly selectBoxHeaderWithSearchInput: string;
    readonly selectBoxHeaderWithSearchInput__inputContainer: string;
    readonly selectBoxHeaderWithSearchInput__icon: string;
    readonly selectBoxHeaderWithSearchInput__input: string;
}

const defaultProps: PickDefaultProps<SelectBox_HeaderWithSearchInput_Props, 'placeholder'> = {
    placeholder: '',
};

/**
 * **SelectBox_HeaderWithSearchInput is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the header component when no value is selected, and a filter/search box is shown.
 */
export default class SelectBox_HeaderWithSearchInput extends PureComponent<SelectBox_HeaderWithSearchInput_Props> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            searchTerm,
            onSearchTermChange,
            onKeyDown,
            placeholder,
            displayLoadingIndicator,
            setFocus,
            theme,
            disabled
        } = this.props;

        return (
            <div className={theme!.selectBoxHeaderWithSearchInput}>
                <Icon
                    icon="search"
                    className={theme!.selectBoxHeaderWithSearchInput__icon}
                />
                <TextInput
                    containerClassName={theme!.selectBoxHeaderWithSearchInput__inputContainer}
                    className={theme!.selectBoxHeaderWithSearchInput__input}
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    setFocus={setFocus}
                    type="search"
                    disabled={disabled}
                />
                {displayLoadingIndicator && <Icon className={theme!.selectBoxHeaderWithSearchInput__icon} spin={true} icon="spinner"/>}
                {searchTerm &&
                    // @ts-ignore
                    <IconButton className={theme!.selectBoxHeaderWithSearchInput__icon} icon="times" onClick={this.clearSearch}/>
                }
            </div>
        );
    }

    private readonly clearSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        this.props.onSearchTermChange('');
    }
}
