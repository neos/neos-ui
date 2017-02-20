import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import style from './style.css';

import {
    Neos,
    ContentCanvas,
    PrimaryToolbar,
    LeftSideBar,
    EditModePanel,
    Drawer,
    Modals,
    RightSideBar,
    SecondaryToolbar,
    FlashMessages,
    FullScreen
} from './index';

const Root = ({store, globalRegistry, configuration, menu}) => {
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
