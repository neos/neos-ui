import 'babel-polyfill';
import 'Shared/Styles/style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import assign from 'lodash.assign';
import registry from '@reduct/registry';

import {configureStore, actions} from './Redux/index';

import initializeJSAPI from 'API/index';
import {ui} from './Plugins/index';

import * as feedbackHandler from './Service/FeedbackHandler/index';

import {
    Neos,
    ContentCanvas,
    PrimaryToolbar,
    LeftSideBar,
    Drawer,
    AddNodeModal,
    RightSideBar,
    ContextBar,
    FlashMessageContainer,
    FullScreen
} from './Containers/index';
import {
    backend,
    nodeTreeService,
    feedbackManager,
    i18n
} from './Service/index';

import style from './style.css';

// Initialize the backend application on load.
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    const csrfToken = appContainer.dataset.csrfToken;
    const configuration = JSON.parse(appContainer.querySelector('[data-json="configuration"]').innerHTML);
    const serverState = JSON.parse(appContainer.querySelector('[data-json="initialState"]').innerHTML);
    const translations = JSON.parse(appContainer.querySelector('[data-json="translations"]').innerHTML);
    const neos = initializeJSAPI(window, csrfToken);
    const store = configureStore({serverState}, neos);

    // Bootstrap the i18n service before the initial render.
    assign(backend, {
        i18n: i18n(translations)
    });

    // Initialize Neos JS API plugins
    neos.use(ui(store));

    ReactDOM.render(
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <Neos configuration={configuration}>
                    <div>
                        <div id="dialog" />
                        <FlashMessageContainer />
                        <FullScreen />
                        <PrimaryToolbar />
                        <ContextBar />
                        <Drawer />
                        <AddNodeModal />
                        <LeftSideBar />
                        <ContentCanvas />
                        <RightSideBar />
                    </div>
                </Neos>
            </Provider>
        </div>,
        appContainer
    );

    // Bootstrap the backend services
    assign(backend, {
        feedbackManager: feedbackManager(store),
        nodeTreeService: nodeTreeService(store, csrfToken),

        asyncComponents: {
            feedbackHandlers: registry()
        }
    });

    // Register FeedbackHandlers
    backend.asyncComponents.feedbackHandlers.registerAll({
        'PackageFactory.Guevara:Success': feedbackHandler.flashMessage,
        'PackageFactory.Guevara:Error': feedbackHandler.flashMessage,
        'PackageFactory.Guevara:Info': feedbackHandler.logToConsole,
        'PackageFactory.Guevara:UpdateWorkspaceInfo': feedbackHandler.updateWorkspaceInfo,
        'PackageFactory.Guevara:ReloadDocument': feedbackHandler.reloadDocument
    });

    //
    // Inform everybody, that the UI has booted successfully
    //
    store.dispatch(actions.System.boot());
});
