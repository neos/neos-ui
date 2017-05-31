import React from 'react';
import PropTypes from 'prop-types';

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

    return (
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
    );
};
App.propTypes = {
    globalRegistry: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired
};

export default App;
