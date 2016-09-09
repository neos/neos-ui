import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {take} from 'redux-saga/effects';

import {actionTypes} from 'Host/Redux/index';
import {
    getAppContainer,
    getMenu,
    getConfiguration,
    getTranslations
} from 'Host/Sagas/System/index';

import style from 'Host/style.css';

import {
    Neos,
    ContentCanvas,
    PrimaryToolbar,
    LeftSideBar,
    Drawer,
    Modals,
    RightSideBar,
    SecondaryToolbar,
    FlashMessages,
    FullScreen
} from 'Host/Containers/index';

function * applicationViewSaga(store) {
    yield take(actionTypes.System.BOOT);

    const appContainer = yield getAppContainer;

    //
    // We'll show just some loading screen,
    // until we're good to go
    //
    ReactDOM.render(
        <div style={{width: '100vw', height: '100vh', backgroundColor: 'black'}}>
            <h1>Loading...</h1>
        </div>,
        appContainer
    );

    yield take(actionTypes.System.READY);

    const menu = yield getMenu;
    const configuration = yield getConfiguration;
    const translations = yield getTranslations;

    //
    // After everything was initilalized correctly, render the application itself.
    //
    ReactDOM.render(
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <Neos
                    configuration={configuration}
                    translations={translations}
                    >
                    <div>
                        <div id="dialog"/>
                        <Modals/>
                        <FlashMessages/>
                        <FullScreen/>
                        <PrimaryToolbar/>
                        <SecondaryToolbar/>
                        <Drawer menuData={menu}/>
                        <LeftSideBar/>
                        <ContentCanvas/>
                        <RightSideBar/>
                    </div>
                </Neos>
            </Provider>
        </div>,
        appContainer
    );
}

export const sagas = [
    applicationViewSaga
];
