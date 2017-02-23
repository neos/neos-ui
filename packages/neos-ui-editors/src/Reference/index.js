import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

@connect($transform({
    contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('@neos-project/neos-ui-i18n')
}))
export default class ReferenceEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        options: PropTypes.shape({
            nodeTypes: PropTypes.arrayOf(PropTypes.string)
        }),
        contextForNodeLinking: PropTypes.object.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.searchNodes = backend.get().endpoints.searchNodes;
        this.optionGenerator = this.optionGenerator.bind(this);
        this.handleDelete = () => this.props.commit('');
    }

    optionGenerator({value, callback}) {
        const searchNodesQuery = this.props.contextForNodeLinking.toJS();
        if (!value && this.props.value) {
            searchNodesQuery.nodeIdentifiers = [this.props.value];
        } else if (!value || value.length < 2) {
            return;
        } else {
            searchNodesQuery.searchTerm = value;
        }

        this.searchNodes(searchNodesQuery).then(result => {
            callback(result);
        });
    }

    render() {
        const {commit, options, i18nRegistry} = this.props;
        const onDelete = this.props.value ? this.handleDelete : null;
        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));

        return (<SelectBox
            options={this.optionGenerator}
            value={this.props.value}
            placeholder={placeholder}
            onSelect={commit}
            onDelete={onDelete}
            />);
    }
}
