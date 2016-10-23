import test from 'ava';

import {
    activeWorkspaceNameSelector,
    publishableNodesSelector,
    publishableNodesInDocumentSelector
} from './selectors.js';

const stateFixture = {
    cr: {
        workspaces: {
            byName: {
                'user-test': {
                    publishableNodes: [
                        {documentContextPath: '/sites/neosdemotypo3org@user-text;language=en_US'},
                        {documentContextPath: '/sites/neosdemotypo3org/blah-blah@user-text;language=en_US'}
                    ]
                }
            },
            active: 'user-test'
        }
    },
    ui: {
        contentCanvas: {
            contextPath: '/sites/neosdemotypo3org@user-text;language=en_US'
        }
    }
};

test(`The "activeWorkspaceNameSelector" should deliver the name of the active workspace`, t => {
    t.is(activeWorkspaceNameSelector(stateFixture), 'user-test');
});

test(`
    The "publishableNodesSelector" should deliver a list of all publshable nodes with
    their respective document context paths attached`, t => {
    t.deepEqual(publishableNodesSelector(stateFixture), [
        {documentContextPath: '/sites/neosdemotypo3org@user-text;language=en_US'},
        {documentContextPath: '/sites/neosdemotypo3org/blah-blah@user-text;language=en_US'}
    ]);
});

test(`
    The "publishableNodesInDocumentSelector" should deliver a list of all publshable nodes
    in the currently open document with their respective document context paths attached`, t => {
    t.deepEqual(publishableNodesInDocumentSelector(stateFixture), [
        {documentContextPath: '/sites/neosdemotypo3org@user-text;language=en_US'}
    ]);
});
