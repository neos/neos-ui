import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import assign from 'lodash.assign';
import registry from '@reduct/registry';

import reducerFactory from './Reducers/';
import {initialStateFactory} from './State/';

import * as feedbackHandler from './Service/FeedbackHandler/';

import {
    ContentView,
    FooterBar,
    TopBar,
    LeftSideBar,
    OffCanvas,
    RightSideBar,
    ContextBar,
    FlashMessageContainer
} from './Containers/';
import {
    backend,
    nodeTypeManager,
    tabManager,
    changeManager,
    feedbackManager,
    publishingService,
    i18n
} from './Service/';

import style from './style.css';

// Add the root class which enables the scoped normalize.css
// ToDo: Remove the scoping and this class to reduce the overall specificity of all styles.
document.documentElement.classList.add(style.neos);

// Initialize the backend application on load.
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    const firstTabUri = appContainer.dataset.firstTab;
    const csrfToken = appContainer.dataset.csrfToken;
    const initialState = initialStateFactory(
        JSON.parse(appContainer.querySelector('[data-json="initialState"]').innerHTML)
    );
    const translations = JSON.parse(appContainer.querySelector('[data-json="translations"]').innerHTML);
    const nodeTypeSchema = JSON.parse(appContainer.querySelector('[data-json="nodeTypeSchema"]').innerHTML);
    const reducers = reducerFactory(initialState);
    const store = createStore(reducers);

    nodeTypeManager.initializeWithNodeTypeSchema(nodeTypeSchema);

    ReactDOM.render(
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <div>
                    <FlashMessageContainer />
                    <TopBar />
                    <ContextBar />
                    <OffCanvas />
                    <LeftSideBar />
                    <ContentView />
                    <RightSideBar />
                    <FooterBar />
              </div>
            </Provider>
        </div>,
        appContainer
    );

    // Bootstrap the backend services
    assign(backend, {
        tabManager: tabManager(store),
        changeManager: changeManager(store, csrfToken),
        feedbackManager: feedbackManager(store),
        publishingService: publishingService(store, csrfToken),
        i18n: i18n(translations),

        asyncComponents: {
            feedbackHandlers: registry()
        }
    });

    backend.tabManager.createTab(firstTabUri);

    // Register FeedbackHandlers
    backend.asyncComponents.feedbackHandlers.registerAll({
        'PackageFactory.Guevara:Success': feedbackHandler.flashMessage,
        'PackageFactory.Guevara:Error': feedbackHandler.flashMessage,
        'PackageFactory.Guevara:Info': feedbackHandler.logToConsole,
        'PackageFactory.Guevara:UpdateWorkspaceInfo': feedbackHandler.updateWorkspaceInfo,
        'PackageFactory.Guevara:ReloadDocument': feedbackHandler.reloadDocument
    });
});
