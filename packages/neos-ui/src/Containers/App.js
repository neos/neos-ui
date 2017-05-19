import React, {PropTypes} from 'react';

import FlashMessages from './FlashMessages/index';

const App = ({globalRegistry, menu}) => {
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

    // HINT: the SecondaryToolbar must be *BELOW* the
    // ContentCanvas; to ensure the SecondaryToolbar is rendered
    // afterwards and can overlay the ContentCanvas
    return (
        <div>
            <div id="dialog"/>
            <Modals/>
            <FlashMessages/>
            <FullScreen/>
            <PrimaryToolbar/>
            <EditModePanel/>
            <ContentCanvas/>
            <SecondaryToolbar/>
            <Drawer menuData={menu}/>
            <LeftSideBar/>
            <RightSideBar/>
        </div>
    );
};
App.propTypes = {
    globalRegistry: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired
};

export default App;
