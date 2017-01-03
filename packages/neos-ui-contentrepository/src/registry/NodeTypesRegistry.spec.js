import test from 'ava';

import NodeTypesRegistry from './NodeTypesRegistry';

test(`
    "getAllowedChildNodeTypes" should return a list of all allowed child node types
    for a given node type`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.setConstraints({
        'Neos.Neos.NodeTypes:Page': {
            nodeTypes: {
                'Neos.Neos.NodeTypes:Page': true,
                'Test:Page': true,
                'Test:Page2': true
            }
        }
    });

    t.deepEqual(nodeTypesRegistry.getAllowedChildNodeTypes('Neos.Neos.NodeTypes:Page'), [
        'Neos.Neos.NodeTypes:Page',
        'Test:Page',
        'Test:Page2'
    ]);
    t.deepEqual(nodeTypesRegistry.getAllowedChildNodeTypes('Neos.Neos.NodeTypes:NotExistent'), []);
});

test(`
    "getAllowedGrandChildNodeTypes" should return a list of all allowed grand child
    node types for a given node type`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.setConstraints({
        'Neos.Neos.NodeTypes:Page': {
            childNodes: {
                main: {
                    nodeTypes: {
                        'Test:Page': true
                    }
                }
            }
        }
    });

    t.deepEqual(nodeTypesRegistry.getAllowedGrandChildNodeTypes('Neos.Neos.NodeTypes:Page', 'main'), [
        'Test:Page'
    ]);
    t.deepEqual(nodeTypesRegistry.getAllowedGrandChildNodeTypes('Neos.Neos.NodeTypes:Page', 'not-existent'), []);
    t.deepEqual(nodeTypesRegistry.getAllowedGrandChildNodeTypes('Neos.Neos.NodeTypes:NotExistent', 'main'), []);
});

test(`"getGroupedNodeTypeList" should return a list of grouped node types.`, t => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.add('Neos.Neos.NodeTypes:Page', {
        name: 'Neos.Neos.NodeTypes:Page',
        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
            group: 'general'
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
            label: 'Neos.Neos:Main:nodeTypes.groups.general',
            position: 'start'
        },
        structure: {
            label: 'Neos.Neos:Main:nodeTypes.groups.structure',
            position: 100
        },
        plugins: {
            label: 'Neos.Neos:Main:nodeTypes.groups.plugins',
            position: 200
        }
    });

    t.deepEqual(nodeTypesRegistry.getGroupedNodeTypeList(), [
        {
            name: 'general',
            label: 'Neos.Neos:Main:nodeTypes.groups.general',
            position: 'start',
            nodeTypes: [
                {
                    name: 'Neos.Neos.NodeTypes:Page',
                    label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
                    ui: {
                        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
                        group: 'general'
                    }
                }
            ]
        },
        {
            name: 'structure',
            label: 'Neos.Neos:Main:nodeTypes.groups.structure',
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

    nodeTypesRegistry.add('Neos.Neos.NodeTypes:Page', {
        name: 'Neos.Neos.NodeTypes:Page',
        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
            group: 'general'
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
            label: 'Neos.Neos:Main:nodeTypes.groups.general',
            position: 'start'
        },
        plugins: {
            label: 'Neos.Neos:Main:nodeTypes.groups.plugins',
            position: 200
        },
        structure: {
            label: 'Neos.Neos:Main:nodeTypes.groups.structure',
            position: 100
        }
    });
    t.deepEqual(nodeTypesRegistry.getGroupedNodeTypeList(['Test:Page', 'Neos.Neos.NodeTypes:Page']), [
        {
            name: 'general',
            label: 'Neos.Neos:Main:nodeTypes.groups.general',
            position: 'start',
            nodeTypes: [
                {
                    name: 'Neos.Neos.NodeTypes:Page',
                    label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
                    ui: {
                        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
                        group: 'general'
                    }
                }
            ]
        },
        {
            name: 'structure',
            label: 'Neos.Neos:Main:nodeTypes.groups.structure',
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

    t.deepEqual(nodeTypesRegistry.getGroupedNodeTypeList(['Neos.Neos.NodeTypes:Page']), [
        {
            name: 'general',
            label: 'Neos.Neos:Main:nodeTypes.groups.general',
            position: 'start',
            nodeTypes: [
                {
                    name: 'Neos.Neos.NodeTypes:Page',
                    label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
                    ui: {
                        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
                        group: 'general'
                    }
                }
            ]
        }
    ]);
});
