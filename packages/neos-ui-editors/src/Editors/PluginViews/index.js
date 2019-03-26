import React from 'react';
import PropTypes from 'prop-types';
import backend from '@neos-project/neos-ui-backend-connector';
import {neos} from '@neos-project/neos-ui-decorators';
import {connect} from 'react-redux';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import mergeClassNames from 'classnames';
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
        className: PropTypes.string,
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

            loadPluginViews(focusedNodeIdentifier, personalWorkspace, activeContentDimensions)
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
                    {this.renderLocationLabel(Object.prototype.hasOwnProperty.call(view, 'pageNode'))}
                    {this.renderLink(view.pageNode)}
                </li>
            );
        }
    }

    renderLocationLabel(onPage) {
        let label = 'content.inspector.editors.pluginViewsEditor.';
        label += onPage ? 'displayedOnPage' : 'displayedOnCurrentPage';
        return this.props.i18nRegistry.translate(label);
    }

    renderLink(pageNode) {
        return (
            pageNode ? <a href="#" onClick={this.handleClick(pageNode.uri)}>{pageNode.title}</a> : null
        );
    }

    handleClick = source => () => {
        const {setActiveContentCanvasSrc} = this.props;
        if (setActiveContentCanvasSrc) {
            setActiveContentCanvasSrc(source);
        }
    }

    render() {
        const {className} = this.props;
        const classNames = mergeClassNames({
            [className]: true,
            [style.pluginViewContainer]: true
        });

        return (
            <ul className={classNames}>
                {this.renderViewListItems()}
            </ul>
        );
    }
}

export default PluginViewsEditor;
