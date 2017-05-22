import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility/src/registry';
import {actions} from '@neos-project/neos-ui-redux-store';
import {$get} from 'plow-js';
import Immutable from 'immutable';
import {createSelector} from 'reselect';

const EMPTY_LIST = Immutable.fromJS([]);

class DataLoaderClient {
    _dataLoaderIdentifier: '';
    _dataLoaderOptions: null;
    _dataLoaderDefinition: null;

    constructor(dataLoaderIdentifier, dataLoaderOptions, dataLoaderDefinition) {
        this._dataLoaderIdentifier = dataLoaderIdentifier;
        this._dataLoaderOptions = dataLoaderOptions;
        this._dataLoaderDefinition = dataLoaderDefinition;
    }

    doInitialize(currentlySelectedDataIdentifier) {
        return actions.UI.DataLoaders.initialize(this._dataLoaderIdentifier, this._dataLoaderOptions, currentlySelectedDataIdentifier);
    }

    doSearch(searchTerm) {
        return actions.UI.DataLoaders.search(this._dataLoaderIdentifier, this._dataLoaderOptions, searchTerm);
    }

    findByIdentifier(identifier, state) {
        const cacheSegment = this._dataLoaderDefinition.makeCacheSegmentSelector(this._dataLoaderOptions)(state);

        return $get(['ui', 'dataLoaders', cacheSegment, 'valuesByIdentifier', identifier], state);
    }

    // FACTORY function for selector with 3 params: (state, currentlySelectedObjectIdentifier, searchTerm)
    makePropsSelector() {
        const cacheSegmentIdSelector = this._dataLoaderDefinition.makeCacheSegmentSelector(this._dataLoaderOptions);

        const cacheSegmentSelector = createSelector([
            $get('ui.dataLoaders'),
            cacheSegmentIdSelector
        ], (dataLoaders, cacheSegmentId) =>
            $get([cacheSegmentId], dataLoaders)
        );

        return createSelector([
            cacheSegmentSelector,
            (_1, currentlySelectedObjectIdentifier) => currentlySelectedObjectIdentifier,
            (_1, _2, searchTerm) => searchTerm
        ], (
            cacheSegment,
            currentlySelectedObjectIdentifier,
            searchTerm
        ) => {
            let optionValues = EMPTY_LIST;

            if (searchTerm) {
                const identifiers = $get(['searchStrings', searchTerm], cacheSegment);
                if (!identifiers) {
                    return {
                        isLoading: true,
                        optionValues: EMPTY_LIST
                    };
                }

                optionValues = identifiers.map(id => $get(['valuesByIdentifier', id], cacheSegment));
            } else if (currentlySelectedObjectIdentifier) {
                const option = $get(['valuesByIdentifier', currentlySelectedObjectIdentifier], cacheSegment);
                if (!option) {
                    return {
                        isLoading: true,
                        optionValues: EMPTY_LIST
                    };
                }
                optionValues = Immutable.fromJS([option]);
            }

            return {
                isLoading: false,
                optionValues
            };
        });
    }
}

export default class DataLoadersRegistry extends SynchronousRegistry {
    constructor(...args) {
        super(...args);
    }

    getClient(dataLoaderIdentifier, dataLoaderOptions) {
        if (!this.has(dataLoaderIdentifier)) {
            throw new Error(`DataLoader with identifier "${dataLoaderIdentifier}" not found.`);
        }
        return new DataLoaderClient(
            dataLoaderIdentifier,
            dataLoaderOptions,
            this.get(dataLoaderIdentifier)
        );
    }
}
