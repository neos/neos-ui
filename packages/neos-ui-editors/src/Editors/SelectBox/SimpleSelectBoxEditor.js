import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import MultiSelectBox from '@neos-project/react-ui-components/src/MultiSelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';
import {shouldDisplaySearchBox, searchOptions, processSelectBoxOptions} from './SelectBoxHelpers';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class SimpleSelectBoxEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any,
        highlight: PropTypes.bool,
        options: PropTypes.shape({
            allowEmpty: PropTypes.bool,
            placeholder: PropTypes.string,

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
        minimumResultsForSearch: 5
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };
    }

    render() {
        const {commit, value, i18nRegistry, highlight} = this.props;
        const options = Object.assign({}, this.constructor.defaultOptions, this.props.options);

        const processedSelectBoxOptions = processSelectBoxOptions(i18nRegistry, options.values);

        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));

        if (options.multiple) {
            return (<MultiSelectBox
                options={processedSelectBoxOptions}
                values={value || []}
                onValuesChange={commit}
                highlight={highlight}
                placeholder={placeholder}
                allowEmpty={options.allowEmpty}
                displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
                searchOptions={searchOptions(this.state.searchTerm, processedSelectBoxOptions)}
                searchTerm={this.state.searchTerm}
                onSearchTermChange={this.handleSearchTermChange}
                />);
        }

        // multiple == FALSE
        return (<SelectBox
            options={this.state.searchTerm ? searchOptions(this.state.searchTerm, processedSelectBoxOptions) : processedSelectBoxOptions}
            value={value}
            onValueChange={commit}
            placeholder={placeholder}
            highlight={highlight}
            allowEmpty={options.allowEmpty}
            displaySearchBox={shouldDisplaySearchBox(options, processedSelectBoxOptions)}
            searchTerm={this.state.searchTerm}
            onSearchTermChange={this.handleSearchTermChange}
            />);
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }
}
