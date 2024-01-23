import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import ErrorBoundary from './ErrorBoundary';
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Neos from './Neos/index';
import style from './style.module.css';

import {config, library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {ResourceIconContext} from "@neos-project/react-ui-components/src/Icon/resourceIcon";

config.autoAddCss = false; // Dont insert the supporting CSS into the <head> of the HTML document
config.familyPrefix = 'neos-fa';
config.replacementClass = 'neos-svg-inline--fa';

library.add(fab, fas, far);

class Root extends PureComponent {
    render() {
        const {store, globalRegistry, configuration, menu, routes} = this.props;

        const containerRegistry = globalRegistry.get('containers');
        const App = containerRegistry.get('App');
        const createFromResourcePath = (path) => '/_Resources/Static/Packages/' + path.substr(11);

        return (
            <ErrorBoundary i18nRegistry={globalRegistry.get('i18n')}>
                <div className={style.applicationWrapper}>
                    <Provider store={store}>
                        <DndProvider backend={HTML5Backend}>
                            <Neos
                                globalRegistry={globalRegistry}
                                configuration={configuration}
                                routes={routes}
                                >
                                <ResourceIconContext.Provider value={{createFromResourcePath}}>
                                    <App globalRegistry={globalRegistry} menu={menu}/>
                                </ResourceIconContext.Provider>
                            </Neos>
                        </DndProvider>
                    </Provider>
                </div>
            </ErrorBoundary>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    globalRegistry: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    menu: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.string.isRequired,
            uri: PropTypes.string.isRequired,
            target: PropTypes.string,

            children: PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.string,
                    label: PropTypes.string.isRequired,
                    uri: PropTypes.string,
                    target: PropTypes.string,
                    isActive: PropTypes.bool.isRequired,
                    skipI18n: PropTypes.bool.isRequired
                })
            )
        })
    ).isRequired,
    routes: PropTypes.object.isRequired
};

export default Root;
