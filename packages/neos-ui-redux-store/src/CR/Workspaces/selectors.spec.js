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

test(`The "baseWorkspaceSelector" should deliver the name of the active workspace`, () => {
    expect(baseWorkspaceSelector(stateFixture)).toBe('live');
});

test(`
    The "publishableNodesSelector" should deliver a list of all publshable nodes with
    their respective document context paths attached`, () => {
    expect(publishableNodesSelector(stateFixture)).toEqual([
        {documentContextPath: '/sites/neosdemo@user-text;language=en_US'},
        {documentContextPath: '/sites/neosdemo/blah-blah@user-text;language=en_US'}
    ]);
});

test(`
    The "publishableNodesInDocumentSelector" should deliver a list of all publshable nodes
    in the currently open document with their respective document context paths attached`, () => {
    expect(publishableNodesInDocumentSelector(stateFixture)).toEqual([
        {documentContextPath: '/sites/neosdemo@user-text;language=en_US'}
    ]);
});
