import {PureComponent, Children} from 'react';
import PropTypes from 'prop-types';
import {SynchronousRegistry, SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

const globalRegistry = new SynchronousMetaRegistry();

// i18n Registry
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

// wrapper
export class WrapWithMockGlobalRegistry extends PureComponent {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired
    };

    getChildContext() {
        const configuration = {};
        return {globalRegistry, configuration};
    }

    render() {
        return Children.only(this.props.children);
    }
}
