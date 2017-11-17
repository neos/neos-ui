import React from 'react';
import PropTypes from 'prop-types';
import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {$transform} from 'plow-js';
import style from './style.css';

@neos(globalRegistry => {
    return {
        i18nRegistry: globalRegistry.get('i18n')
    };
})

@connect($transform({
    activeContentDimensions: selectors.CR.ContentDimensions.active,
    personalWorkspace: selectors.CR.Workspaces.personalWorkspaceNameSelector,
    focusedNodeIdentifier: selectors.CR.Nodes.focusedNodeIdentifierSelector
}), {
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc
})

class PluginViewsEditor extends React.PureComponent {
    static propTypes = {
        i18nRegistry: PropTypes.object.isRequired,
        activeContentDimensions: PropTypes.object.isRequired,
        personalWorkspace: PropTypes.string,
        focusedNodeIdentifier: PropTypes.string.isRequired,
        setActiveContentCanvasSrc: PropTypes.func
    };

    state = {
        isLoading: false,
        views: []
    };

    componentDidMount() {
        const {personalWorkspace, activeContentDimensions, focusedNodeIdentifier} = this.props;

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

    handleClick(source) {
        const {setActiveContentCanvasSrc} = this.props;
        if (setActiveContentCanvasSrc) {
            setActiveContentCanvasSrc(source);
        }
    }

    renderViewListItems() {
        const {isLoading, views} = this.state;

        if (isLoading) {
            return (
                <li className={style.pluginViewContainer__listItem}>
                    {this.props.i18nRegistry.translate('Neos.Neos:Main:loading', 'Loading')}
                </li>
            );
        }

        if (views.length > 0) {
            return views.map(view =>
                <li className={style.pluginViewContainer__listItem} key={view.label}>
                    <b>{view.label}</b>
                    {this.props.i18nRegistry.translate('content.inspector.editors.pluginViewsEditor.displayedOnPage')}
                    <a href="#" className="neos-link-ajax" onClick={() => this.handleClick(view.pageNode.uri)}>{view.pageNode.title}</a>
                </li>
            );
        }
    }

    render() {
        return (
            <ul className={style.pluginViewContainer}>
                {this.renderViewListItems()}
            </ul>
        );
    }
}

export default PluginViewsEditor;
