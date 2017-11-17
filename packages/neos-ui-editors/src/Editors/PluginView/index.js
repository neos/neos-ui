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
    focusedNodeIdentifier: selectors.CR.Nodes.focusedNodeIdentifierSelector
}))

class PluginViewEditor extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        commit: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        activeContentDimensions: PropTypes.object.isRequired,
        personalWorkspace: PropTypes.string,
        focusedNodeIdentifier: PropTypes.string.isRequired
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

    state = {
        isLoading: false,
        views: []
    };

    componentDidMount() {
        const {personalWorkspace, activeContentDimensions, focusedNodeIdentifier} = this.props;

        console.log(focusedNodeIdentifier);
        if (!focusedNodeIdentifier) {
            return;
        }

        const {loadPluginViews} = backend.get().endpoints;

        if (!this.state.views.length) {
            this.setState({isLoading: true});

            loadPluginViews(focusedNodeIdentifier, personalWorkspace, activeContentDimensions.toJS())
                .then(views => {
                    const viewsArray = [];
                    for (const viewName in views) {
                        if (views[viewName]) {
                            viewsArray.push(views[viewName]);
                        }
                    }

                    this.setState({
                        isLoading: false,
                        views: viewsArray
                    });
                });
        }
    }

    handleValueChange = value => {
        this.props.commit(value);
    }

    render() {
        const {views, isLoading} = this.state;

        console.log(views);
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
