import {createStore} from 'redux';
import {reducer, actions, initialState} from './index.js';

import {handleActions} from 'Host/Util/HandleActions/';

const {setData, setSubTree, setNode} = actions;

describe('"host.redux.ui.contentView" ', () => {
    let store = null;

    beforeEach(done => {
        store = createStore(
            handleActions(reducer),
            {
                ui: {
                    pageTree: initialState
                }
            }
        );

        done();
    });

    afterEach(done => {
        store = null;

        done();
    });
});
