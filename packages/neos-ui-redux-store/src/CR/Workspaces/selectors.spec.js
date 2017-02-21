import test from 'ava';

import {
    baseWorkspaceSelector,
    publishableNodesSelector,
    publishableNodesInDocumentSelector
} from './selectors.js';

const stateFixture = {
    cr: {
        workspaces: {
            personalWorkspace: {
                name: 'user-text',
                publishableNodes: [
                    {documentContextPath: '/sites/neosdemo@user-text;language=en_US'},
                    {documentContextPath: '/sites/neosdemo/blah-blah@user-text;language=en_US'}
                ],
                baseWorkspace: 'live'
            }
        }
    },
    ui: {
        contentCanvas: {
            contextPath: '/sites/neosdemo@user-text;language=en_US'
        }
    }
};

test(`The "baseWorkspaceSelector" should deliver the name of the active workspace`, t => {
    t.is(baseWorkspaceSelector(stateFixture), 'live');
});

test(`
    The "publishableNodesSelector" should deliver a list of all publshable nodes with
    their respective document context paths attached`, t => {
    t.deepEqual(publishableNodesSelector(stateFixture), [
        {documentContextPath: '/sites/neosdemo@user-text;language=en_US'},
        {documentContextPath: '/sites/neosdemo/blah-blah@user-text;language=en_US'}
    ]);
});

test(`
    The "publishableNodesInDocumentSelector" should deliver a list of all publshable nodes
    in the currently open document with their respective document context paths attached`, t => {
    t.deepEqual(publishableNodesInDocumentSelector(stateFixture), [
        {documentContextPath: '/sites/neosdemo@user-text;language=en_US'}
    ]);
});
