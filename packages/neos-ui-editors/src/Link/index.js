import React, {PureComponent, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import {neos} from '@neos-project/neos-ui-decorators';

const removePrefixFromNodeIdentifier = nodeIdentifierWithPrefix =>
    nodeIdentifierWithPrefix && nodeIdentifierWithPrefix.replace('node://', '');

const appendPrefixBeforeNodeIdentifier = nodeIdentifier =>
    nodeIdentifier && 'node://' + nodeIdentifier;

@neos((globalRegistry, props) => {
    const dataLoaderOptions = {
        nodeTypes: $get('options.nodeTypes', props)
    };

    return {
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').getClient('NodeLookup', dataLoaderOptions),
        i18nRegistry: globalRegistry.get('i18n')
    };
})
@connect((state, {nodeLookupDataLoader}) => {
    const propsSelector = nodeLookupDataLoader.makePropsSelector();

    return (state, {value, searchTerm}) => ({
        ...propsSelector(state, removePrefixFromNodeIdentifier(value), searchTerm)
    });
}, (dispatch, {nodeLookupDataLoader}) => ({
    initializeDataLoader: (...args) => dispatch(nodeLookupDataLoader.doInitialize(...args)),
    search: (...args) => dispatch(nodeLookupDataLoader.doSearch(...args))
}))
class LinkEditor extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string),
            placeholder: PropTypes.string
        }),

        i18nRegistry: PropTypes.object.isRequired,

        // from nodeLookupDataLoader.makePropsSelector();
        optionValues: ImmutablePropTypes.listOf(
            ImmutablePropTypes.contains({
                identifier: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired
            })
        ),
        isLoading: PropTypes.bool.isRequired,

        initializeDataLoader: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired,

        // TODO: coming from a stateful component *above* wrapping the search term. This is only needed because we need the search term in the data loader (connect above)
        onSearchTermChange: PropTypes.func.isRequired,
        searchTerm: PropTypes.string.isRequired
    };

    componentDidMount() {
        this.props.initializeDataLoader(removePrefixFromNodeIdentifier(this.props.value));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.props.initializeDataLoader(removePrefixFromNodeIdentifier(this.props.value));
        }
    }

    handleSearchTermChange = searchTerm => {
        this.props.search(searchTerm);
        this.props.onSearchTermChange(searchTerm);
    }
    handleValueChange = value => {
        this.props.commit(appendPrefixBeforeNodeIdentifier(value));
    }

    render() {
        return (
            <SelectBox
                options={this.props.optionValues.toJS()}
                optionValueField="identifier"
                value={this.props.value && removePrefixFromNodeIdentifier(this.props.value)}
                onValueChange={this.handleValueChange}
                placeholder={this.props.i18nRegistry.translate(this.props.options.placeholder)}
                displayLoadingIndicator={this.props.isLoading}
                displaySearchBox={true}
                searchTerm={this.props.searchTerm}
                onSearchTermChange={this.handleSearchTermChange}
                />
        );
    }
}

class StatefulLinkEditor extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };
    }

    handleSearchTermChange = searchTerm => {
        this.setState({searchTerm});
    }

    render() {
        return (
            <LinkEditor
                {...this.props}
                searchTerm={this.state.searchTerm}
                onSearchTermChange={this.handleSearchTermChange}
                />
        );
    }

}

export default StatefulLinkEditor;

