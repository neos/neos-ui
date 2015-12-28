import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import reducerFactory from './Reducers/';
import {initialStateFactory} from './State/';

import {ContentView, FooterBar, TopBar, LeftSideBar} from './Containers/';
import {documentManager, nodeTypeManager, tabManager} from './Service/';

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    const firstTabUri = appContainer.dataset.firstTab;
    const initialState = initialStateFactory(
        JSON.parse(appContainer.querySelector('[data-json="initialState"]').innerHTML)
    );
    const nodeTypeSchema = JSON.parse(appContainer.querySelector('[data-json="nodeTypeSchema"]').innerHTML);
    const reducers = reducerFactory(initialState);
    const store = createStore(reducers);

    nodeTypeManager.initializeWithNodeTypeSchema(nodeTypeSchema);

    ReactDOM.render(
        <div>
            <Provider store={store}>
              <div>
                  <TopBar />
                  <LeftSideBar />
                  <ContentView />
                  <FooterBar />
              </div>
            </Provider>
        </div>,
        appContainer
    );

    window['@Neos:Backend'] = {
        documentManager: documentManager(store),
        tabManager: tabManager(store)
    };

    window['@Neos:Backend'].tabManager.createTab(firstTabUri);

    window.store = store;
});
