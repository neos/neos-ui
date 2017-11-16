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
    personalWorkspace: selectors.CR.Workspaces.personalWorkspaceNameSelector
}))

class MasterPluginEditor extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        activeContentDimensions: PropTypes.object.isRequired,
        personalWorkspace: PropTypes.string
    };

    constructor(...args) {
        super(...args);

        this.state = {
            isLoading: false,
            options: []
        };
    }

    renderPlaceholder() {
        const placeholderPrefix = 'Neos.Neos:Main:content.inspector.editors.masterPluginEditor.',
            placeholderLabel = placeholderPrefix + (this.state.options.length > 0 ?  'selectPlugin' : 'noPluginConfigured');
        return this.props.i18nRegistry.translate(placeholderLabel);
    }

    transformMasterPluginStructure(plugins) {
        const pluginsList = [];
        for (var property in plugins) {
            if (plugins.hasOwnProperty(property)) {
                pluginsList.push({
                    'value': property,
                    'label': plugins[property]
                });
            }
        }

        return pluginsList;
    }

    componentDidMount() {
        if (!this.props.value) {
            return;
        }

        const {loadMasterPlugins} = backend.get().endpoints,
            {personalWorkspace, activeContentDimensions} = this.props;

        if (!this.state.options.length) {
            this.setState({isLoading: true});

            loadMasterPlugins(personalWorkspace, activeContentDimensions.toJS())
                .then(options => {
                    this.setState({
                        isLoading: false,
                        options: this.transformMasterPluginStructure(options)
                    });
                });
        }
    }

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        const {options, isLoading} = this.state;
        const {highlight, value} = this.props;

        return (
            <SelectBox
                options={options}
                highlight={highlight}
                value={value}
                onValueChange={this.handleValueChange}
                displayLoadingIndicator={isLoading}
                displaySearchBox={false}
                placeholder={this.renderPlaceholder()}
                />
        );
    }
}

export default MasterPluginEditor;
