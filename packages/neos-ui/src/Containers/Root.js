import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import style from './style.css';

import Neos from './Neos/index';

class Root extends PureComponent {
    render() {
        const {store, globalRegistry, configuration, menu, routes} = this.props;

        const containerRegistry = globalRegistry.get('containers');
        const App = containerRegistry.get('App');

        return (
            <div className={style.applicationWrapper}>
                <Provider store={store}>
                    <DndProvider backend={HTML5Backend}>
                        <Neos
                            globalRegistry={globalRegistry}
                            configuration={configuration}
                            routes={routes}
                            >
                            <App globalRegistry={globalRegistry} menu={menu}/>
                        </Neos>
                    </DndProvider>
                </Provider>
            </div>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    globalRegistry: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
};

export default Root;
