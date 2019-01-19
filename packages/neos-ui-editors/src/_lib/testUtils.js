import React, {PureComponent, Children} from 'react';
import PropTypes from 'prop-types';
import {SynchronousRegistry, SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {NeosContext} from '@neos-project/neos-ui-decorators';

const globalRegistry = new SynchronousMetaRegistry();

// I18n Registry
class FakeI18NRegistry extends SynchronousRegistry {
    translate(key) {
        return key;
    }
}
globalRegistry.set('i18n', new FakeI18NRegistry());

// Data Source DataLoader
export const MockDataSourceDataLoader = {
    _currentPromise: null,
    _currentPromiseResolveFn: null,

    // API in tests
    reset() {
        this._currentPromise = null;
    },

    resolveCurrentPromise(result) {
        this._currentPromiseResolveFn(result);
        return this._currentPromise;
    },

    // API of DataLoader
    resolveValue() {
        if (!this._currentPromise) {
            this._currentPromise = new Promise(resolve => {
                this._currentPromiseResolveFn = resolve;
            });
        }
        return this._currentPromise;
    }
};
globalRegistry.set('dataLoaders', new SynchronousRegistry());
globalRegistry.get('dataLoaders').set('DataSources', MockDataSourceDataLoader);

// Wrapper
export class WrapWithMockGlobalRegistry extends PureComponent {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    static contextType = NeosContext;

    render() {
        const configuration = {};
        const routes = {};
        return <NeosContext.Provider value={{configuration, globalRegistry, routes}}>
            {Children.only(this.props.children)}
        </NeosContext.Provider>;
    }
}
