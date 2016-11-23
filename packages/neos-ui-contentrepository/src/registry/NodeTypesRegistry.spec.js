import test from 'ava';

import NodeTypesRegistry from './NodeTypesRegistry';

test(`
    "getAllowedChildNodeTypes" should return a list of all allowed child node types
    for a given node type`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.setConstraints({
        'TYPO3.Neos.NodeTypes:Page': {
            nodeTypes: {
                'TYPO3.Neos.NodeTypes:Page': true,
                'Test:Page': true,
                'Test:Page2': true
            }
        }
    });

    t.deepEqual(nodeTypesRegistry.getAllowedChildNodeTypes('TYPO3.Neos.NodeTypes:Page'), [
        'TYPO3.Neos.NodeTypes:Page',
        'Test:Page',
        'Test:Page2'
    ]);
    t.deepEqual(nodeTypesRegistry.getAllowedChildNodeTypes('TYPO3.Neos.NodeTypes:NotExistent'), []);
});

test(`
    "getAllowedGrandChildNodeTypes" should return a list of all allowed grand child
    node types for a given node type`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.setConstraints({
        'TYPO3.Neos.NodeTypes:Page': {
            childNodes: {
                main: {
                    nodeTypes: {
                        'Test:Page': true
                    }
                }
            }
        }
    });

    t.deepEqual(nodeTypesRegistry.getAllowedGrandChildNodeTypes('TYPO3.Neos.NodeTypes:Page', 'main'), [
        'Test:Page'
    ]);
    t.deepEqual(nodeTypesRegistry.getAllowedGrandChildNodeTypes('TYPO3.Neos.NodeTypes:Page', 'not-existent'), []);
    t.deepEqual(nodeTypesRegistry.getAllowedGrandChildNodeTypes('TYPO3.Neos.NodeTypes:NotExistent', 'main'), []);
});

test(`"getGroupedNodeTypeList" should return a list of grouped node types.`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.add('TYPO3.Neos.NodeTypes:Page', {
        name: 'TYPO3.Neos.NodeTypes:Page',
        label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label'
        }
    });
    nodeTypesRegistry.add('Test:Page', {
        name: 'Test:Page',
        ui: {
            label: 'The test page type',
            group: 'structure',
            position: 200
        }
    });
    nodeTypesRegistry.add('Test:Page2', {
        name: 'Test:Page2',
        ui: {
            label: 'The test page type 2',
            group: 'structure',
            position: 100
        }
    });

    nodeTypesRegistry.setGroups({
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
    });

    t.deepEqual(nodeTypesRegistry.getGroupedNodeTypeList(), [
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
        },
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
        }
    ]);
});

test(`"getGroupedNodeTypeList" should take the given nodeType filter into account.`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.add('TYPO3.Neos.NodeTypes:Page', {
        name: 'TYPO3.Neos.NodeTypes:Page',
        label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'TYPO3.Neos.NodeTypes:NodeTypes.Page:ui.label'
        }
    });
    nodeTypesRegistry.add('Test:Page', {
        name: 'Test:Page',
        ui: {
            label: 'The test page type',
            group: 'structure',
            position: 200
        }
    });
    nodeTypesRegistry.add('Test:Page2', {
        name: 'Test:Page2',
        ui: {
            label: 'The test page type 2',
            group: 'structure',
            position: 100
        }
    });

    nodeTypesRegistry.setGroups({
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
    });

    t.deepEqual(nodeTypesRegistry.getGroupedNodeTypeList(['Test:Page', 'TYPO3.Neos.NodeTypes:Page']), [
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
        },
        {
            name: 'structure',
            label: 'TYPO3.Neos:Main:nodeTypes.groups.structure',
            position: 100,
            nodeTypes: [
                {
                    name: 'Test:Page',
                    ui: {
                        label: 'The test page type',
                        group: 'structure',
                        position: 200
                    }
                }
            ]
        }
    ]);

    t.deepEqual(nodeTypesRegistry.getGroupedNodeTypeList(['TYPO3.Neos.NodeTypes:Page']), [
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
    ]);
});
