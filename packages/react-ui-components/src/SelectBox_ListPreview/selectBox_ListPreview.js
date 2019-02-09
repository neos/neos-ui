/* eslint-disable camelcase, react/jsx-pascal-case */
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox_Option_SingleLine from '../SelectBox_Option_SingleLine';

/**
 * **SelectBox_ListPreview is an internal implementation detail of SelectBox**, meant to improve code quality.
 *
 * It is used inside SelectBox as the dropdown part.
 */
class SelectBox_ListPreview extends PureComponent {
    static propTypes = {
        // For explanations of the PropTypes, see SelectBox.js
        options: PropTypes.arrayOf(
            PropTypes.shape({
            }),
        ),
        // Number of characters left to type before search
        searchTermLeftToType: PropTypes.number,
        noMatchesFound: PropTypes.bool,
        searchBoxLeftToTypeLabel: PropTypes.string,
        noMatchesFoundLabel: PropTypes.string,
        theme: PropTypes.object,

        // Dependency injection
        SelectBox_CreateNew: PropTypes.any.isRequired,
        SelectBox_ListPreviewFlat: PropTypes.any.isRequired,
        SelectBox_ListPreviewGrouped: PropTypes.any.isRequired
    }

    render() {
        const {
            options,
            searchTermLeftToType,
            noMatchesFound,
            noMatchesFoundLabel,
            SelectBox_CreateNew,
            SelectBox_ListPreviewFlat,
            SelectBox_ListPreviewGrouped,
            searchBoxLeftToTypeLabel,
            theme
        } = this.props;

        const ListPreviewComponent = options.some(option => option.group) ? SelectBox_ListPreviewGrouped : SelectBox_ListPreviewFlat;

        // TODO: replace horible self-made I18n replace
        return (
            <Fragment>
                {searchTermLeftToType > 0 ? (
                    <div className={theme.selectBox__item}>
                        <SelectBox_Option_SingleLine
                            option={{label: `${searchBoxLeftToTypeLabel && searchBoxLeftToTypeLabel.replace('###CHARACTERS###', searchTermLeftToType)}`}}
                            key={'___leftToType'}
                            />
                    </div>
                ) : (
                    <ListPreviewComponent {...this.props}/>
                )}
                {noMatchesFound && (
                    <div className={theme.selectBox__item}>
                        <SelectBox_Option_SingleLine
                            option={{label: noMatchesFoundLabel, icon: 'ban'}}
                            key={'___noResults'}
                            />
                    </div>
                )}
                <div className={theme.selectBox__item}>
                    <SelectBox_CreateNew {...this.props}/>
                </div>
            </Fragment>
        );
    }
}

export default SelectBox_ListPreview;
