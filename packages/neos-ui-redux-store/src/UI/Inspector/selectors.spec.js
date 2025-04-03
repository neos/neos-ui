import produce from 'immer';

import * as selectors from './selectors';

test(`transientValues should return the transient inspector values for the currently focused node`, () => {
    const state = {
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {
                    dummyContextPath: {
                        some: 'transientValue'
                    }
                }
            }
        }
    };

    expect(selectors.transientValues(state)).toEqual({
        some: 'transientValue'
    });
});

test(`Inspector is dirty when transient values are set`, () => {
    const state = {
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {
                    dummyContextPath: {
                        some: 'transientValue'
                    }
                }
            }
        }
    };

    expect(selectors.isDirty(state)).toBe(true);
});

test(`Inspector is not dirty when no transient values are set`, () => {
    const state = {
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {
                    dummyContextPath: {}
                }
            }
        }
    };

    expect(selectors.isDirty(state)).toBe(false);
    expect(selectors.isDirty(produce(state, state => {
        state.ui.inspector.valuesByNodePath.dummyContextPath = null
    }))).toBe(false);
    expect(selectors.isDirty(produce(state, state => {
        state.ui.inspector.valuesByNodePath.dummyContextPath = undefined
    }))).toBe(false);
});

test(`Inspector is not dirty when no transient values have been dropped`, () => {
    const state = {
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {
                    dummyContextPath: {
                        some: 'transientValue'
                    }
                }
            }
        }
    };
    const nextState = produce(state, state => {
        delete state.ui.inspector.valuesByNodePath.dummyContextPath;
    });

    expect(selectors.isDirty(nextState)).toBe(false);

    expect(selectors.isDirty(nextState)).toBe(false);
});

test(`validationErrorsSelector should return null, when there's no validator configuration`, () => {
    const nodeTypesRegistry = {
        get: () => ({
            properties: {}
        })
    };
    const validatorRegistry = {
        get: () => () => null
    };
    const validationErrorsSelector = selectors.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const state = {
        ui: {
            inspector: {
                valuesByNodePath: {}
            }
        },
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                },
                byContextPath: {
                    dummyContextPath: {
                        properties: {
                            title: 'Foo'
                        }
                    }
                }
            }
        }
    };

    expect(validationErrorsSelector(state)).toEqual(null);
});

test(`validationErrorsSelector should read the nodeType configuration for the currently focused node`, () => {
    const nodeTypesRegistry = {
        get: jest.fn().mockReturnValue({properties: {}})
    };
    const validatorRegistry = {
        get: () => () => null
    };

    const validationErrorsSelector = selectors.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const state = {
        ui: {
            inspector: {
                valuesByNodePath: {}
            }
        },
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                },
                byContextPath: {
                    dummyContextPath: {
                        nodeType: 'DummyNodeType'
                    }
                }
            }
        }
    };

    validationErrorsSelector(state);

    expect(nodeTypesRegistry.get).toBeCalledWith('DummyNodeType');
});

test(`validationErrorsSelector should return validationErrors, when there are invalid field`, () => {
    const nodeTypesRegistry = {
        get: () => ({
            ui: {
                inspector: {
                    valuesByNodePath: {}
                }
            },
            properties: {
                title: {
                    validation: {
                        required: {}
                    }
                },
                label: {
                    validation: {
                        required: {}
                    }
                }
            }
        })
    };
    const validatorRegistry = {
        get: () => () => 'ValidationError'
    };
    const validationErrorsSelector = selectors.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const state = {
        ui: {
            inspector: {
                valuesByNodePath: {}
            }
        },
        cr: {
            nodes: {
                focused: {
                    contextPaths: ['dummyContextPath']
                },
                byContextPath: {
                    dummyContextPath: {
                        properties: {
                            title: '',
                            label: ''
                        }
                    }
                }
            }
        }
    };

    expect(validationErrorsSelector(state)).toEqual({
        title: ['ValidationError'],
        label: ['ValidationError']
    });
});
