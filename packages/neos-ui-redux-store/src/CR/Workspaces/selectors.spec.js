import {
    baseWorkspaceSelector,
    publishableNodesSelector,
    publishableNodesInDocumentSelector,
    makeIsDocumentNodeDirtySelector,
    makeIsContentNodeDirtySelector
} from './selectors';

const isDocumentNodeDirtySelector = makeIsDocumentNodeDirtySelector();
const isContentNodeDirtySelector = makeIsContentNodeDirtySelector();

const stateFixture = {
    cr: {
        workspaces: {
            personalWorkspace: {
                name: 'user-text',
                publishableNodes: [
                    {documentContextPath: '/sites/neosdemo@user-text;language=en_US'},
                    {documentContextPath: '/sites/neosdemo/blah-blah@user-text;language=en_US'},
                    {contextPath: '/sites/neosdemo/content@user-text;language=en_US'}
                ],
                baseWorkspace: 'live'
            }
        },
        nodes: {
            documentNode: '/sites/neosdemo@user-text;language=en_US'
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
        {documentContextPath: '/sites/neosdemo/blah-blah@user-text;language=en_US'},
        {contextPath: '/sites/neosdemo/content@user-text;language=en_US'}
    ]);
});

test(`
    The "publishableNodesInDocumentSelector" should deliver a list of all publshable nodes
    in the currently open document with their respective document context paths attached`, () => {
    expect(publishableNodesInDocumentSelector(stateFixture)).toEqual([
        {documentContextPath: '/sites/neosdemo@user-text;language=en_US'}
    ]);
});

test(`isDocumentNodeDirtySelector should reflect the publishing state`, () => {
    expect(isDocumentNodeDirtySelector(stateFixture, '/sites/neosdemo@user-text;language=en_US')).toBe(true);
    expect(isDocumentNodeDirtySelector(stateFixture, '/sites/neosdemo/blah-blah@user-text;language=en_US')).toBe(true);
    expect(isDocumentNodeDirtySelector(stateFixture, '/sites/neosdemo/content@user-text;language=en_US')).toBe(true);
    expect(isDocumentNodeDirtySelector(stateFixture, '/sites/neosdemo/some-page@user-text;language=en_US')).toBe(false);
});

test(`isContentNodeDirtySelector should reflect the publishing state`, () => {
    expect(isDocumentNodeDirtySelector(stateFixture, '/sites/neosdemo/content@user-text;language=en_US')).toBe(true);
    expect(isContentNodeDirtySelector(stateFixture, '/sites/neosdemo@user-text;language=en_US')).toBe(false);
    expect(isContentNodeDirtySelector(stateFixture, '/sites/neosdemo/blah-blah@user-text;language=en_US')).toBe(false);
    expect(isContentNodeDirtySelector(stateFixture, '/sites/neosdemo/some-page@user-text;language=en_US')).toBe(false);
});
