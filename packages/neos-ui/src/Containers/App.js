import React from 'react';
import PropTypes from 'prop-types';

import FlashMessages from './FlashMessages/index';

const App = ({globalRegistry, menu}) => {
    const containerRegistry = globalRegistry.get('containers');

    const Modals = containerRegistry.get('Modals');
    const PrimaryToolbar = containerRegistry.get('PrimaryToolbar');
    const SecondaryToolbar = containerRegistry.get('SecondaryToolbar');
    const Drawer = containerRegistry.get('Drawer');
    const LeftSideBar = containerRegistry.get('LeftSideBar');
    const ContentCanvas = containerRegistry.get('ContentCanvas');
    const RightSideBar = containerRegistry.get('RightSideBar');
    const LoadingIndicator = containerRegistry.get('SecondaryToolbar/LoadingIndicator');

    // HINT: the SecondaryToolbar must be *BELOW* the
    // ContentCanvas; to ensure the SecondaryToolbar is rendered
    // afterwards and can overlay the ContentCanvas
    return (
        <div>
            <div id="dialog"/>
            <Modals/>
            <FlashMessages/>
            <LoadingIndicator/>
            <PrimaryToolbar/>
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
