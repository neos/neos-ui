import preprocessNodeConfiguration from './preprocessNodeConfiguration';

describe(`preprocessing NodeConfiguration`, () => {
    const context = {
        node: {
            properties: {
                property: 1
            }
        },
        parentNode: {}
    };

    test(`empty configuration`, () => {
        const givenConfig = {};
        const processedConfig = preprocessNodeConfiguration(context, givenConfig);

        expect(processedConfig).toEqual({});
    });

    test(`creation dialog configuration without clientEval`, () => {
        const givenConfig = {
            elements: {
                property: {
                    type: 'integer',
                    ui: {
                        editorOptions: {
                            placeholder: 'Neos.Neos:Main:choose',
                            values: {
                                1: {
                                    label: '1'
                                },
                                2: {
                                    label: '2'
                                }
                            }
                        },
                        editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor',
                        defaultValue: 0,
                        label: 'MyVendor.AwesomeNeosProject:NodeTypes.Content.NodeWithDependingProperties:properties.property'
                    },
                    defaultValue: 1,
                    validation: {
                        'Neos.Neos/Validation/NotEmptyValidator': []
                    }
                },
                otherProperty: {
                    type: 'string',
                    ui: {
                        editorOptions: {
                            placeholder: 'Neos.Neos:Main:choose',
                            dataSourceIdentifier: 'data-source-2',
                            dataSourceAdditionalData: {
                                property: 1
                            },
                            dataSourceDisableCaching: true
                        },
                        editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor',
                        defaultValue: '',
                        label: 'MyVendor.AwesomeNeosProject:NodeTypes.Content.NodeWithDependingProperties:properties.otherProperty'
                    },
                    validation: {
                        'Neos.Neos/Validation/NotEmptyValidator': []
                    }
                }
            }
        }
        const expectedConfig = JSON.parse(JSON.stringify(givenConfig))
        const processedConfiguration = preprocessNodeConfiguration(context, givenConfig);

        expect(processedConfiguration).toEqual(expectedConfig);
    });

    test(`creation dialog configuration with clientEval`, () => {
        const givenConfig = {
            elements: {
                property: {
                    type: 'integer',
                    ui: {
                        editorOptions: {
                            placeholder: 'Neos.Neos:Main:choose',
                            values: {
                                1: {
                                    label: '1'
                                },
                                2: {
                                    label: '2'
                                }
                            }
                        },
                        editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor',
                        defaultValue: 0,
                        label: 'MyVendor.AwesomeNeosProject:NodeTypes.Content.NodeWithDependingProperties:properties.property'
                    },
                    defaultValue: 1,
                    validation: {
                        'Neos.Neos/Validation/NotEmptyValidator': []
                    }
                },
                otherProperty: {
                    type: 'string',
                    ui: {
                        editorOptions: {
                            placeholder: 'Neos.Neos:Main:choose',
                            dataSourceIdentifier: 'data-source-2',
                            dataSourceAdditionalData: {
                                property: 'ClientEval:node.properties.property'
                            },
                            dataSourceDisableCaching: true
                        },
                        editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor',
                        defaultValue: '',
                        label: 'MyVendor.AwesomeNeosProject:NodeTypes.Content.NodeWithDependingProperties:properties.otherProperty'
                    },
                    validation: {
                        'Neos.Neos/Validation/NotEmptyValidator': []
                    }
                }
            }
        }
        const expectedConfig = {
            elements: {
                property: {
                    type: 'integer',
                    ui: {
                        editorOptions: {
                            placeholder: 'Neos.Neos:Main:choose',
                            values: {
                                1: {
                                    label: '1'
                                },
                                2: {
                                    label: '2'
                                }
                            }
                        },
                        editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor',
                        defaultValue: 0,
                        label: 'MyVendor.AwesomeNeosProject:NodeTypes.Content.NodeWithDependingProperties:properties.property'
                    },
                    defaultValue: 1,
                    validation: {
                        'Neos.Neos/Validation/NotEmptyValidator': []
                    }
                },
                otherProperty: {
                    type: 'string',
                    ui: {
                        editorOptions: {
                            placeholder: 'Neos.Neos:Main:choose',
                            dataSourceIdentifier: 'data-source-2',
                            dataSourceAdditionalData: {
                                property: 1
                            },
                            dataSourceDisableCaching: true
                        },
                        editor: 'Neos.Neos/Inspector/Editors/SelectBoxEditor',
                        defaultValue: '',
                        label: 'MyVendor.AwesomeNeosProject:NodeTypes.Content.NodeWithDependingProperties:properties.otherProperty'
                    },
                    validation: {
                        'Neos.Neos/Validation/NotEmptyValidator': []
                    }
                }
            }
        }
        const processedConfiguration = preprocessNodeConfiguration(context, givenConfig);

        expect(processedConfiguration).toEqual(expectedConfig);
    });
})
