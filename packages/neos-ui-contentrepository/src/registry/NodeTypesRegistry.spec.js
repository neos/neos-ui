import NodeTypesRegistry from './NodeTypesRegistry';

test(`
    "getAllowedChildNodeTypes" should return a list of all allowed child node types
    for a given node type`, () => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.set('Neos.Neos.NodeTypes:Page', {
        name: 'Neos.Neos.NodeTypes:Page',
        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label'
        }
    });
    nodeTypesRegistry.set('Test:Page', {
        name: 'Test:Page',
        ui: {
            label: 'The test page type'
        }
    });
    nodeTypesRegistry.set('Test:Page2', {
        name: 'Test:Page2',
        ui: {
            label: 'The test page type 2'
        }
    });

    nodeTypesRegistry.setConstraints({
        'Neos.Neos.NodeTypes:Page': {
            nodeTypes: {
                'Neos.Neos.NodeTypes:Page': true,
                'Test:Mixin': true,
                'Test:Page': true,
                'Test:Page2': true
            }
        }
    });

    expect(nodeTypesRegistry.getAllowedChildNodeTypes('Neos.Neos.NodeTypes:Page')).toEqual([
        'Neos.Neos.NodeTypes:Page',
        'Test:Page',
        'Test:Page2'
    ]);
    expect(
        nodeTypesRegistry.getAllowedChildNodeTypes('Neos.Neos.NodeTypes:NotExistent')
    ).toEqual([]);
});

test(`
    "getAllowedGrandChildNodeTypes" should return a list of all allowed grand child
    node types for a given node type`, () => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.set('Neos.Neos.NodeTypes:Page', {
        name: 'Neos.Neos.NodeTypes:Page',
        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label'
        }
    });
    nodeTypesRegistry.set('Test:Page', {
        name: 'Test:Page',
        ui: {
            label: 'The test page type'
        }
    });
    nodeTypesRegistry.set('Test:Page2', {
        name: 'Test:Page2',
        ui: {
            label: 'The test page type 2'
        }
    });

    nodeTypesRegistry.setConstraints({
        'Neos.Neos.NodeTypes:Page': {
            childNodes: {
                main: {
                    nodeTypes: {
                        'Test:Mixin': true,
                        'Test:Page': true
                    }
                }
            }
        }
    });

    expect(
        nodeTypesRegistry.getAllowedGrandChildNodeTypes('Neos.Neos.NodeTypes:Page', 'main')
    ).toEqual([
        'Test:Page'
    ]);
    expect(
        nodeTypesRegistry.getAllowedGrandChildNodeTypes('Neos.Neos.NodeTypes:Page', 'not-existent')
    ).toEqual([]);
    expect(
        nodeTypesRegistry.getAllowedGrandChildNodeTypes('Neos.Neos.NodeTypes:NotExistent', 'main')
    ).toEqual([]);
});

test(`"getGroupedNodeTypeList" should return a list of grouped node types.`, () => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.set('Neos.Neos.NodeTypes:Page', {
        name: 'Neos.Neos.NodeTypes:Page',
        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
            group: 'general'
        }
    });
    nodeTypesRegistry.set('Test:Page', {
        name: 'Test:Page',
        ui: {
            label: 'The test page type',
            group: 'structure',
            position: 200
        }
    });
    nodeTypesRegistry.set('Test:Page2', {
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

    expect(nodeTypesRegistry.getGroupedNodeTypeList()).toEqual([
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

test(`"getGroupedNodeTypeList" should take the given nodeType filter into account.`, () => {
    const nodeTypesRegistry = new NodeTypesRegistry(``);

    nodeTypesRegistry.set('Neos.Neos.NodeTypes:Page', {
        name: 'Neos.Neos.NodeTypes:Page',
        label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
        ui: {
            label: 'Neos.Neos.NodeTypes:NodeTypes.Page:ui.label',
            group: 'general'
        }
    });
    nodeTypesRegistry.set('Test:Page', {
        name: 'Test:Page',
        ui: {
            label: 'The test page type',
            group: 'structure',
            position: 200
        }
    });
    nodeTypesRegistry.set('Test:Page2', {
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
    expect(
        nodeTypesRegistry.getGroupedNodeTypeList(['Test:Page', 'Neos.Neos.NodeTypes:Page'])
    ).toEqual([
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

    expect(nodeTypesRegistry.getGroupedNodeTypeList(['Neos.Neos.NodeTypes:Page'])).toEqual([
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
