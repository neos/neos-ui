import React from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from './ErrorBoundary/index';
import FlashMessages from './FlashMessages/index';

const App = ({globalRegistry, menu}) => {
    const containerRegistry = globalRegistry.get('containers');

    const Modals = containerRegistry.get('Modals');
    const PrimaryToolbar = containerRegistry.get('PrimaryToolbar');
    const EditModePanel = containerRegistry.get('EditModePanel');
    const SecondaryToolbar = containerRegistry.get('SecondaryToolbar');
    const Drawer = containerRegistry.get('Drawer');
    const LeftSideBar = containerRegistry.get('LeftSideBar');
    const ContentCanvas = containerRegistry.get('ContentCanvas');
    const RightSideBar = containerRegistry.get('RightSideBar');
    const LoadingIndicator = containerRegistry.get('SecondaryToolbar/LoadingIndicator');

    console.log('foo');

    // HINT: the SecondaryToolbar must be *BELOW* the
    // ContentCanvas; to ensure the SecondaryToolbar is rendered
    // afterwards and can overlay the ContentCanvas
    return (
        <div>
            <div id="dialog"/>
            <Modals/>
            <FlashMessages/>

            <ErrorBoundary>
                <LoadingIndicator/>
            </ErrorBoundary>

            <ErrorBoundary>
                <PrimaryToolbar/>
            </ErrorBoundary>

            <ErrorBoundary>
                <ContentCanvas/>
            </ErrorBoundary>

            <ErrorBoundary>
                <SecondaryToolbar/>
            </ErrorBoundary>

            <ErrorBoundary>
                <EditModePanel/>
            </ErrorBoundary>

            <ErrorBoundary>
                <Drawer menuData={menu}/>
            </ErrorBoundary>

            <ErrorBoundary>
                <LeftSideBar/>
            </ErrorBoundary>

            <ErrorBoundary>
                <RightSideBar/>
            </ErrorBoundary>
        </div>
    );
};
App.propTypes = {
    globalRegistry: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired
};

export default App;
