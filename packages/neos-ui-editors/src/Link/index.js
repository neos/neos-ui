import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const removePrefixFromNodeIdentifier = nodeIdentifierWithPrefix =>
    nodeIdentifierWithPrefix && nodeIdentifierWithPrefix.replace('node://', '');

const appendPrefixBeforeNodeIdentifier = nodeIdentifier =>
    'node://' + nodeIdentifier;

@neos((globalRegistry, props) => {
    const dataLoaderOptions = {
        nodeTypes: $get('options.nodeTypes', props)
    };

    return {
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').getClient('NodeLookup', dataLoaderOptions),
        i18nRegistry: globalRegistry.get('i18n')
    }
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

        initializeDataLoader: PropTypes.func.isRequired,

        isLoading: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.props.initializeDataLoader(removePrefixFromNodeIdentifier(this.props.value));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            // TODO
            //this.props.initializeDataLoader(removePrefixFromNodeIdentifier(this.props.value));
        }
    }

    handleSearchTermChange = searchTerm => {
        this.props.search('LinkEditor_' + this.props.identifier, searchTerm);
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
                displayLoadingIndicator={false}
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
        return <LinkEditor {...this.props}
            searchTerm={this.state.searchTerm}
            onSearchTermChange={this.handleSearchTermChange}
            />
    }

}

export default StatefulLinkEditor;

