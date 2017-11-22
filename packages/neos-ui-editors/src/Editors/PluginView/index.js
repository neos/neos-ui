import React from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {$transform} from 'plow-js';

@neos(globalRegistry => {
    return {
        i18nRegistry: globalRegistry.get('i18n')
    };
})

@connect($transform({
    activeContentDimensions: selectors.CR.ContentDimensions.active,
    personalWorkspace: selectors.CR.Workspaces.personalWorkspaceNameSelector,
    focusedNode: selectors.CR.Nodes.focusedSelector
}))

class PluginViewEditor extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        activeContentDimensions: PropTypes.object.isRequired,
        personalWorkspace: PropTypes.string,
        focusedNode: PropTypes.instanceOf(PluginViewEditor).isRequired
    };

    state = {
        isLoading: false,
        options: []
    };

    renderPlaceholder() {
        const placeholderPrefix = 'Neos.Neos:Main:content.inspector.editors.masterPluginEditor.';
        const placeholderLabel = placeholderPrefix + (this.state.views.length > 0 ? 'selectPlugin' : 'noPluginConfigured');
        return this.props.i18nRegistry.translate(placeholderLabel);
    }

    transformPluginStructure(plugins) {
        const pluginsList = [];
        for (const key in plugins) {
            if (plugins[key] === undefined || plugins[key].label === undefined) {
                continue;
            }
            pluginsList.push({value: key, label: plugins[key].label});
        }

        return pluginsList;
    }

    componentDidMount() {
        const {personalWorkspace, activeContentDimensions, focusedNode} = this.props;

        if (!focusedNode) {
            return;
        }

        const {loadPluginViews} = backend.get().endpoints;
        const pluginNode = focusedNode.get('properties');

        if (!this.state.views.length && pluginNode.size > 0) {
            const pluginNodeIdentifier = pluginNode.get('plugin');
            this.setState({isLoading: true});

            loadPluginViews(pluginNodeIdentifier, personalWorkspace, activeContentDimensions.toJS())
                .then(views => {
                    this.setState({
                        isLoading: false,
                        views: this.transformPluginStructure(views)
                    });
                });
        }
    }

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        const {views, isLoading} = this.state;

        return (
            <SelectBox
                options={views}
                value={this.props.value}
                onValueChange={this.handleValueChange}
                displayLoadingIndicator={isLoading}
                displaySearchBox={false}
                placeholder={this.renderPlaceholder()}
                allowEmpty
                />
        );
    }
}

export default PluginViewEditor;
