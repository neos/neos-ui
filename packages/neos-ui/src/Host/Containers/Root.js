import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
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

const Root = ({store, configuration, translations, menu}) => {
    return (
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
        </div>
    );
};
Root.propTypes = {
    store: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired
};

export default Root;
