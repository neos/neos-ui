import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import assign from 'lodash.assign';
import reducerFactory from './Reducers/';
import {initialStateFactory} from './State/';
import {
    ContentView,
    FooterBar,
    TopBar,
    LeftSideBar,
    RightSideBar,
    ContextBar
} from './Containers/';
import {
    backend,
    nodeTypeManager,
    tabManager,
    changeManager,
    feedbackManager
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
    const nodeTypeSchema = JSON.parse(appContainer.querySelector('[data-json="nodeTypeSchema"]').innerHTML);
    const reducers = reducerFactory(initialState);
    const store = createStore(reducers);

    nodeTypeManager.initializeWithNodeTypeSchema(nodeTypeSchema);

    ReactDOM.render(
        <div className={style.applicationWrapper}>
            <Provider store={store}>
              <div>
                  <TopBar />
                  <ContextBar />
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
        feedbackManager: feedbackManager(store)
    });

    backend.tabManager.createTab(firstTabUri);
});
