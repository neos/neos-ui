import {
    activeWorkspaceNameSelector,
    publishableNodesSelector,
    publishableNodesInDocumentSelector
} from './index.js';

describe.only('"host.selectors.workspaces" ', () => {
    let state = null;

    beforeEach(done => {
        state = {
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
                contentView: {
                    contextPath: '/sites/neosdemotypo3org@user-text;language=en_US'
                }
            }
        };

        done();
    });

    afterEach(done => {
        state = null;
        done();
    });

    describe('activeWorkspaceNameSelector.', () => {
        it('should work.', () => {
            expect(activeWorkspaceNameSelector(state)).to.eql('user-test');
        });
    });
    describe('publishableNodesSelector.', () => {
        it('should work.', () => {
            expect(publishableNodesSelector(state)).to.eql([
                {documentContextPath: '/sites/neosdemotypo3org@user-text;language=en_US'},
                {documentContextPath: '/sites/neosdemotypo3org/blah-blah@user-text;language=en_US'}
            ]);
        });
    });
    describe('publishableNodesInDocumentSelector.', () => {
        it('should work.', () => {
            expect(publishableNodesInDocumentSelector(state)).to.eql([
                {documentContextPath: '/sites/neosdemotypo3org@user-text;language=en_US'}
            ]);
        });
    });
});
