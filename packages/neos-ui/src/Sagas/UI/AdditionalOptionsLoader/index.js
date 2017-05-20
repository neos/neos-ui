import {takeLatest} from 'redux-saga';
import {put, select, fork} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {iframeDocument} from '../../../Containers//ContentCanvas/Helpers/dom';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';

/**
 * Load newly created page into canvas
 */
function * watchNodeChange({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const inspectorEditorRegistry = globalRegistry.get('inspector').get('editors');

    yield * takeLatest([
        actionTypes.System.INIT,
        actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH,
        actionTypes.CR.Nodes.FOCUS
    ], function * nodeCreated(action) {
        try {
            yield fork(doInitialRequests);
        } finally {

        }

        //yield delay(1);
        try {
            const focusedNode = yield select(selectors.CR.Nodes.focusedSelector);
            const nodeType = nodeTypesRegistry.get($get('nodeType', focusedNode));

            const preparedDataLoaders = Object.keys($get('properties', nodeType))
                .map(propertyName => {
                    const currentPropertyValue = $get(['properties', propertyName], focusedNode);

                    if (!currentPropertyValue) {
                        // no value set; so we do not need to load anything.
                        // !! WRONG; we might need to load *EVERYTHING* if specified. -> but not in the case of the Link Editor.
                        return null;
                    }

                    const propertyDefinition = $get(['properties', propertyName], nodeType);
                    if (!$get('ui.inspector.editor', propertyDefinition)) {
                        // remove the ones which do not have an editor set
                        return null;
                    }

                    const {makeDataLoader} = inspectorEditorRegistry.get($get('ui.inspector.editor', propertyDefinition));

                    if (makeDataLoader) {
                        // TODO: put NODE IN HERE as well
                        const dataLoader = makeDataLoader($get('ui.inspector.editorOptions', propertyDefinition));
                        console.log("DATA LOADER", dataLoader);
                        return dataLoader;
                    } else {
                        return null;
                    }
                }).filter(el => Boolean(el));

            console.log("x", preparedDataLoaders);
            yield fork(watch)
        } finally {

        }
    });
}

export const sagas = [
    watchNodeChange
];
