import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {SelectBox, MultiSelectBox} from '@neos-project/react-ui-components';
import {neos} from '@neos-project/neos-ui-decorators';
import {shouldDisplaySearchBox, searchOptions, processSelectBoxOptions} from './SelectBoxHelpers';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class SimpleSelectBoxEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any,
        className: PropTypes.string,
        options: PropTypes.shape({
            allowEmpty: PropTypes.bool,
            placeholder: PropTypes.string,
            disabled: PropTypes.bool,

            multiple: PropTypes.bool,

            minimumResultsForSearch: PropTypes.number,

            values: PropTypes.objectOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    icon: PropTypes.string,

                    // TODO
                    group: PropTypes.string
                })
            )

        }).isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    static defaultOptions = {
        // Use "5" as minimum result for search default; same as with old UI
        minimumResultsForSearch: 5,
        threshold: 0,
        disabled: false
    };

    state = {
        searchTerm: ''
    };

    render() {
        const {commit, i18nRegistry, className} = this.props;
        let {value} = this.props;
        const options = Object.assign({}, this.constructor.defaultOptions, this.props.options);

        const processedSelectBoxOptions = processSelectBoxOptions(i18nRegistry, options.values);

        const allowEmpty = options.allowEmpty || Object.prototype.hasOwnProperty.call(options.values, '');

        // Placeholder text must be unescaped in case html entities were used
        let placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const invalidPlaceholder = i18nRegistry.translate('Neos.Neos.Ui:Main:invalidValue');

        function isValidValueInArray(values) {
            if (values.length === 0) {
                return true;
            }
            const valueKeys = Object.keys(options.values);
            return values.every((value) => valueKeys.includes(value));
        }

        function isValidValueInString(value) {
            if (value === '') {
                return true;
            }
            const valueKeys = Object.keys(options.values);
            return valueKeys.find((v) => v === value);
        }

        if (Array.isArray(value)) {
            const isValidValue = isValidValueInArray(value);
            if (!isValidValue) {
                placeholder = invalidPlaceholder;
                value = [];
            }
        } else {
            const isValidValue = isValidValueInString(value);
            if (!isValidValue) {
                placeholder = invalidPlaceholder;
                value = null;
            }
        }

        if (options.multiple) {
            return (<MultiSelectBox
                className={className}
                options={processedSelectBoxOptions}
                values={value}
                onValuesChange={commit}
                placeholder={placeholder}
                allowEmpty={allowEmpty}
                displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
                searchOptions={searchOptions(this.state.searchTerm, processedSelectBoxOptions)}
                onSearchTermChange={this.handleSearchTermChange}
                noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
                searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
                threshold={options.threshold}
                disabled={options.disabled}
            />);
        }

        // Multiple == FALSE
        return (<SelectBox
            options={this.state.searchTerm ? searchOptions(this.state.searchTerm, processedSelectBoxOptions) : processedSelectBoxOptions}
            value={value}
            className={className}
            onValueChange={commit}
            placeholder={placeholder}
            allowEmpty={allowEmpty}
            displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
            onSearchTermChange={this.handleSearchTermChange}
            noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:noMatchesFound')}
            searchBoxLeftToTypeLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:searchBoxLeftToType')}
            threshold={options.threshold}
            disabled={options.disabled}
        />);
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }
}
