import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import style from './style.css';

import Neos from './Neos/index';
import FlashMessages from './FlashMessages/index';

const Root = ({store, globalRegistry, configuration, menu}) => {
    const containerRegistry = globalRegistry.get('containers');

    const Modals = containerRegistry.get('Modals');
    const FullScreen = containerRegistry.get('FullScreen');
    const PrimaryToolbar = containerRegistry.get('PrimaryToolbar');
    const EditModePanel = containerRegistry.get('EditModePanel');
    const SecondaryToolbar = containerRegistry.get('SecondaryToolbar');
    const Drawer = containerRegistry.get('Drawer');
    const LeftSideBar = containerRegistry.get('LeftSideBar');
    const ContentCanvas = containerRegistry.get('ContentCanvas');
    const RightSideBar = containerRegistry.get('RightSideBar');

    return (
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <Neos
                    globalRegistry={globalRegistry}
                    configuration={configuration}
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
                        <LeftSideBar/>
                        <ContentCanvas/>
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
    menu: PropTypes.object.isRequired
};

export default Root;
