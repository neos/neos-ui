import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContextProvider} from 'react-dnd';
import style from './style.css';

import Neos from './Neos/index';

const Root = ({store, globalRegistry, configuration, menu, routes}) => {
    const containerRegistry = globalRegistry.get('containers');

    const App = containerRegistry.get('App');

    return (
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <DragDropContextProvider backend={HTML5Backend}>
                    <Neos
                        globalRegistry={globalRegistry}
                        configuration={configuration}
                        routes={routes}
                        >
                        <App globalRegistry={globalRegistry} menu={menu}/>
                    </Neos>
                </DragDropContextProvider>
            </Provider>
        </div>
    );
};
Root.propTypes = {
    store: PropTypes.object.isRequired,
    globalRegistry: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
};

export default Root;
