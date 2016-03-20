import {
    allowedChildNodeTypesSelector,
    allowedChildNodeTypesForAutocreatedNodeSelector,
    allowedNodeTypesSelector,
    groupedAllowedNodeTypesSelector
} from './index.js';

describe('"host.selectors.cr.constraints" ', () => {
    let state = null;

    beforeEach(done => {
        state = {
            cr: {
                nodes: {
                    byContextPath: {
                        '/sites/neosdemotypo3org@user-bob;language=en_US': {
                            name: 'neosdemotypo3org',
                            nodeType: 'TYPO3.Neos.NodeTypes:Page'
                        },
                        '/sites/neosdemotypo3org/download@user-bob;language=en_US': {
                            name: 'download',
                            nodeType: 'TYPO3.Neos.NodeTypes:Page'
                        },
                        '/sites/neosdemotypo3org/download/inside@user-bob;language=en_US': {
                            name: 'inside',
                            nodeType: 'TYPO3.Neos.NodeTypes:Page'
                        }
                    }
                },
                nodeTypes: {
                    byName: {
                        'TYPO3.Neos.NodeTypes:Page': {
                            label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label',
                            ui: {
                                label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label'
                            }
                        },
                        'Test:Page': {
                            ui: {
                                label: 'The test page type',
                                group: 'structure',
                                position: 200
                            }
                        },
                        'Test:Page2': {
                            ui: {
                                label: 'The test page type 2',
                                group: 'structure',
                                position: 100
                            }
                        }
                    },
                    constraints: {
                        'TYPO3.Neos.NodeTypes:Page': {
                            nodeTypes: {
                                'TYPO3.Neos.NodeTypes:Page': true,
                                'Test:Page': true,
                                'Test:Page2': true
                            },
                            childNodes: {
                                main: {
                                    nodeTypes: {
                                        'Test:Page': true
                                    }
                                }
                            }
                        }
                    },
                    groups: {
                        general: {
                            label: 'TYPO3.Neos:Main:nodeTypes.groups.general',
                            position: 'start'
                        },
                        plugins: {
                            label: 'TYPO3.Neos:Main:nodeTypes.groups.plugins',
                            position: 200
                        },
                        structure: {
                            label: 'TYPO3.Neos:Main:nodeTypes.groups.structure',
                            position: 100
                        }
                    }
                }
            }
        };

        done();
    });

    afterEach(done => {
        state = null;
        done();
    });

    describe('allowedChildNodeTypesSelector.', () => {
        it('should work.', () => {
            expect(allowedChildNodeTypesSelector(state)('TYPO3.Neos.NodeTypes:Page')).to.eql(['TYPO3.Neos.NodeTypes:Page', 'Test:Page', 'Test:Page2']);
        });
    });

    describe('allowedChildNodeTypesForAutocreatedNodeSelector.', () => {
        it('should work.', () => {
            expect(allowedChildNodeTypesForAutocreatedNodeSelector(state)('TYPO3.Neos.NodeTypes:Page', 'main')).to.eql(['Test:Page']);
        });
    });

    describe('allowedNodeTypesSelector.', () => {
        it('should work.', () => {
            const referenceNode = state.cr.nodes.byContextPath['/sites/neosdemotypo3org/download/inside@user-bob;language=en_US'];
            const mode = 'insert';
            const result = allowedNodeTypesSelector(state)(referenceNode, mode);
            const expected = [
                {
                    name: 'TYPO3.Neos.NodeTypes:Page',
                    label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label',
                    ui: {
                        label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label'
                    }
                },
                {
                    name: 'Test:Page',
                    ui: {
                        label: 'The test page type',
                        group: 'structure',
                        position: 200
                    }
                },
                {
                    name: 'Test:Page2',
                    ui: {
                        label: 'The test page type 2',
                        group: 'structure',
                        position: 100
                    }
                }
            ];
            expect(result).to.eql(expected);
        });
    });

    describe('groupedAllowedNodeTypesSelector.', () => {
        it('should work.', () => {
            const referenceNode = state.cr.nodes.byContextPath['/sites/neosdemotypo3org/download/inside@user-bob;language=en_US'];
            const mode = 'insert';
            const result = groupedAllowedNodeTypesSelector(state)(referenceNode, mode);
            const expected = [
                {
                    name: 'structure',
                    label: 'TYPO3.Neos:Main:nodeTypes.groups.structure',
                    position: 100,
                    nodeTypes: [
                        {
                            name: 'Test:Page2',
                            ui: {
                                label: 'The test page type 2',
                                group: 'structure',
                                position: 100
                            }
                        },
                        {
                            name: 'Test:Page',
                            ui: {
                                label: 'The test page type',
                                group: 'structure',
                                position: 200
                            }
                        }
                    ]
                },
                {
                    name: 'general',
                    label: 'TYPO3.Neos:Main:nodeTypes.groups.general',
                    position: 'start',
                    nodeTypes: [
                        {
                            name: 'TYPO3.Neos.NodeTypes:Page',
                            label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label',
                            ui: {
                                label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label'
                            }
                        }
                    ]
                }
            ];
            expect(result).to.eql(expected);
        });
    });
});
