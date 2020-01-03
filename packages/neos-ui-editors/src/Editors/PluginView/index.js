import React from 'react';
import PropTypes from 'prop-types';
import SelectBox from '@neos-project/react-ui-components/src/SelectBox/';
import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {$transform, $get} from 'plow-js';

@neos(globalRegistry => {
    return {
        i18nRegistry: globalRegistry.get('i18n')
    };
})

@connect($transform({
    activeContentDimensions: selectors.CR.ContentDimensions.active,
    personalWorkspace: selectors.CR.Workspaces.personalWorkspaceNameSelector,
    focusedNode: selectors.CR.Nodes.focusedSelector,
    transientValues: selectors.UI.Inspector.transientValues
}))

class PluginViewEditor extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        className: PropTypes.string,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        activeContentDimensions: PropTypes.object.isRequired,
        personalWorkspace: PropTypes.string,
        focusedNode: PropTypes.object.isRequired,
        transientValues: PropTypes.object
        // focusedNode: PropTypes.instanceOf(PluginViewEditor).isRequired TODO: This is currently broken and gives an error in console, needs to be fixed
    };

    state = {
        isLoading: false,
        options: []
    };

    renderPlaceholder() {
        const placeholderPrefix = 'Neos.Neos:Main:content.inspector.editors.masterPluginEditor.';
        const placeholderLabel = placeholderPrefix + (this.state.options.length > 0 ? 'selectPlugin' : 'noPluginConfigured');
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
        this.loadOptions(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ($get('plugin.value', nextProps.transientValues) !== $get('plugin.value', this.props.transientValues)) {
            this.loadOptions(nextProps);
        }
    }

    loadOptions(props) {
        const {personalWorkspace, activeContentDimensions, focusedNode, transientValues} = props;
        if (!focusedNode) {
            return;
        }

        const {loadPluginViews} = backend.get().endpoints;

        const pluginNodeProperties = $get('properties', focusedNode);

        if (pluginNodeProperties.plugin) {
            const pluginNodeIdentifier = $get('plugin.value', transientValues) === undefined ? $get('plugin', pluginNodeProperties) : $get('plugin.value', transientValues);
            this.setState({isLoading: true});
            loadPluginViews(pluginNodeIdentifier, personalWorkspace, activeContentDimensions)
                .then(views => {
                    this.setState({
                        isLoading: false,
                        options: this.transformPluginStructure(views)
                    });
                });
        }
    }

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        const {options, isLoading} = this.state;
        const disabled = $get('options.disabled', this.props);

        return (
            <SelectBox
                options={options}
                className={this.props.className}
                value={this.props.value}
                onValueChange={this.handleValueChange}
                displayLoadingIndicator={isLoading}
                displaySearchBox={false}
                placeholder={this.renderPlaceholder()}
                noMatchesFoundLabel={this.props.i18nRegistry.translate('Neos.Neos:Main:content.inspector.editors.masterPluginEditor.noPluginConfigured')}
                allowEmpty
                disabled={disabled}
                />
        );
    }
}

export default PluginViewEditor;
