import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import style from './style.css';

import {
    Neos,
    ContentCanvas,
    PrimaryToolbar,
    LeftSideBar,
    EditModePanel,
    EditorToolbar,
    Drawer,
    Modals,
    RightSideBar,
    SecondaryToolbar,
    FlashMessages,
    FullScreen
} from './index';

const Root = ({store, globalRegistry, configuration, translations, menu}) => {
    return (
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <Neos
                    globalRegistry={globalRegistry}
                    configuration={configuration}
                    translations={translations}
                    >
                    <div>
                        <div id="dialog"/>
                        <Modals/>
                        <FlashMessages/>
                        <FullScreen/>
                        <PrimaryToolbar/>
                        <EditModePanel/>
                        <SecondaryToolbar/>
                        <Drawer menuData={menu}/>
                        <ContentCanvas/>
                        <EditorToolbar/>
                        <LeftSideBar/>
                        <RightSideBar/>
                    </div>
                </Neos>
            </Provider>
        </div>
    );
};
Root.propTypes = {
    store: PropTypes.object.isRequired,
    globalRegistry: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired
};

export default Root;
