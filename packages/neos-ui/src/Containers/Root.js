import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {withDragDropContext} from '@neos-project/neos-ui-decorators';
import style from './style.css';

import Neos from './Neos/index';

const Root = ({store, globalRegistry, configuration, menu, routes}) => {
    const containerRegistry = globalRegistry.get('containers');

    const App = containerRegistry.get('App');

    return (
        <div className={style.applicationWrapper}>
            <Provider store={store}>
                <Neos
                    globalRegistry={globalRegistry}
                    configuration={configuration}
                    routes={routes}
                    >
                    <App globalRegistry={globalRegistry} menu={menu}/>
                </Neos>
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

export default withDragDropContext(Root);
