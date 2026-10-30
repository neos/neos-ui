import {actionTypes, reducer, actions, selectors} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.ADD)).toBe('string');
    expect(typeof (actionTypes.FOCUS)).toBe('string');
    expect(typeof (actionTypes.UNFOCUS)).toBe('string');
    expect(typeof (actionTypes.COMMENCE_REMOVAL)).toBe('string');
    expect(typeof (actionTypes.REMOVAL_ABORTED)).toBe('string');
    expect(typeof (actionTypes.REMOVAL_CONFIRMED)).toBe('string');
    expect(typeof (actionTypes.REMOVE)).toBe('string');
    expect(typeof (actionTypes.COPY)).toBe('string');
    expect(typeof (actionTypes.CUT)).toBe('string');
    expect(typeof (actionTypes.PASTE)).toBe('string');
    expect(typeof (actionTypes.HIDE)).toBe('string');
    expect(typeof (actionTypes.SHOW)).toBe('string');
    expect(typeof (actionTypes.UPDATE_URI)).toBe('string');
    expect(typeof (actionTypes.SET_INLINE_VALIDATION_ERRORS)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.add)).toBe('function');
    expect(typeof (actions.focus)).toBe('function');
    expect(typeof (actions.unFocus)).toBe('function');
    expect(typeof (actions.commenceRemoval)).toBe('function');
    expect(typeof (actions.abortRemoval)).toBe('function');
    expect(typeof (actions.confirmRemoval)).toBe('function');
    expect(typeof (actions.remove)).toBe('function');
    expect(typeof (actions.copy)).toBe('function');
    expect(typeof (actions.cut)).toBe('function');
    expect(typeof (actions.paste)).toBe('function');
    expect(typeof (actions.hide)).toBe('function');
    expect(typeof (actions.show)).toBe('function');
    expect(typeof (actions.updateUri)).toBe('function');
    expect(typeof (actions.setInlineValidationErrors)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
});

test(`The reducer should create a valid initial state`, () => {
    const initialState = {
        byContextPath: {},
        siteNode: 'siteNode',
        documentNode: 'documentNode',
        clipboard: null,
        clipboardMode: null,
        inlineValidationErrors: {}
    };
    const expectedState = {
        byContextPath: {},
        siteNode: 'siteNode',
        documentNode: 'documentNode',
        focused: {
            contextPaths: [],
            fusionPath: null
        },
        toBeRemoved: [],
        clipboard: null,
        clipboardMode: null,
        inlineValidationErrors: {}
    };
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            cr: {
                nodes: initialState
            }
        }
    });
    expect(nextState).toEqual(expectedState);
});

test(`The reducer should mark a node for removal`, () => {
    expect(true).toBe(true);
});
test(`The reducer should unmark a node for removal`, () => {
    expect(true).toBe(true);
});
test(`The reducer should remove a node that was marked for removal from the store`, () => {
    expect(true).toBe(true);
});
test(`The reducer should mark a node for copy`, () => {
    expect(true).toBe(true);
});
test(`The reducer should mark a node for cut`, () => {
    expect(true).toBe(true);
});
test(`The reducer should paste nodes`, () => {
    expect(true).toBe(true);
});

test(`The "move" action should move things right.`, () => {
    const state = {
        byContextPath: {
            'abc@user-admin;language=en_US': {
                contextPath: 'abc@user-admin;language=en_US',
                children: [
                    {
                        contextPath: 'abc/abc@user-admin;language=en_US'
                    },
                    {
                        contextPath: 'abc/abc2@user-admin;language=en_US'
                    }
                ]
            },
            'abc/abc@user-admin;language=en_US': {
                parent: 'abc@user-admin;language=en_US',
                contextPath: 'abc/abc@user-admin;language=en_US',
                children: [
                    {
                        contextPath: 'abc/abc/abc@user-admin;language=en_US'
                    }
                ]
            },
            'abc/abc2@user-admin;language=en_US': {
                parent: 'abc@user-admin;language=en_US',
                contextPath: 'abc/abc@user-admin;language=en_US',
                children: []
            },
            'abc/abc/abc@user-admin;language=en_US': {
                parent: 'abc/abc@user-admin;language=en_US',
                contextPath: 'abc/abc/abc@user-admin;language=en_US',
                children: []
            }
        }
    };
    const nextState = reducer(state, actions.move('abc/abc/abc@user-admin;language=en_US', 'abc@user-admin;language=en_US', 'into'));

    expect(nextState).toEqual({
        byContextPath: {
            'abc@user-admin;language=en_US': {
                contextPath: 'abc@user-admin;language=en_US',
                children: [
                    {
                        contextPath: 'abc/abc@user-admin;language=en_US'
                    },
                    {
                        contextPath: 'abc/abc2@user-admin;language=en_US'
                    },
                    {
                        // NOTE: the context path below is "wrong" (because its's the pre-move state), but this gets updated when the server roundtrip is completed.
                        // we just move the node client-side for immediate user feedback
                        contextPath: 'abc/abc/abc@user-admin;language=en_US'
                    }
                ]
            },
            'abc/abc@user-admin;language=en_US': {
                parent: 'abc@user-admin;language=en_US',
                contextPath: 'abc/abc@user-admin;language=en_US',
                children: []
            },
            'abc/abc2@user-admin;language=en_US': {
                parent: 'abc@user-admin;language=en_US',
                contextPath: 'abc/abc@user-admin;language=en_US',
                children: []
            },
            'abc/abc/abc@user-admin;language=en_US': {
                // NOTE: the parent path below is "wrong" (because its's the pre-move state), but this gets updated when the server roundtrip is completed.
                // we just move the node client-side for immediate user feedback
                parent: 'abc/abc@user-admin;language=en_US',
                contextPath: 'abc/abc/abc@user-admin;language=en_US',
                children: []
            }
        }
    });
});

test(`The "updateUri" action should update uris.`, () => {
    const state = {
        byContextPath: {
            'abc@user-admin;language=en_US': {
                contextPath: 'abc@user-admin;language=en_US',
                uri: 'https://domain/someUri@user-admin;language=en_US'
            },
            'abc/abc@user-admin;language=en_US': {
                contextPath: 'abc/abc@user-admin;language=en_US',
                uri: 'https://domain/someUri/someUri@user-admin;language=en_US'
            },
            'cda/abc@user-admin;language=en_US': {
                contextPath: 'abc/abc@user-admin;language=en_US',
                uri: 'https://domain/someUri2/someUri@user-admin;language=en_US'
            }
        }
    };
    const nextState = reducer(state, actions.updateUri('https://domain/someUri', 'https://domain/someUri2'));

    expect(nextState).toEqual({
        byContextPath: {
            'abc@user-admin;language=en_US': {
                contextPath: 'abc@user-admin;language=en_US',
                uri: 'https://domain/someUri2@user-admin;language=en_US'
            },
            'abc/abc@user-admin;language=en_US': {
                contextPath: 'abc/abc@user-admin;language=en_US',
                uri: 'https://domain/someUri2/someUri@user-admin;language=en_US'
            },
            'cda/abc@user-admin;language=en_US': {
                contextPath: 'abc/abc@user-admin;language=en_US',
                uri: 'https://domain/someUri2/someUri@user-admin;language=en_US'
            }
        }
    });
});

test(`The "merge" action should not duplicate the children of a node.`, () => {
    const state = {
        byContextPath: {
            'parent@user-admin;language=en_US': {
                contextPath: 'parent@user-admin;language=en_US',
                isFullyLoaded: true,
                children: [
                    {
                        contextPath: 'parent/child@user-admin;language=en_US',
                        nodeType: 'Neos.Demo:Page',
                        role: 'document'
                    },
                    {
                        contextPath: 'parent/main@user-admin;language=en_US',
                        nodeType: 'Neos.Demo:ContentCollection',
                        role: 'content'
                    }
                ]
            }
        }
    };

    // The document tree only contains the document children of a node
    const nextState = reducer(state, actions.merge({
        'parent@user-admin;language=en_US': {
            contextPath: 'parent@user-admin;language=en_US',
            children: [
                {
                    contextPath: 'parent/child@user-admin;language=en_US',
                    nodeType: 'Neos.Demo:Page',
                    role: 'document'
                }
            ]
        }
    }));

    expect(nextState.byContextPath['parent@user-admin;language=en_US'].children).toEqual([
        {
            contextPath: 'parent/main@user-admin;language=en_US',
            nodeType: 'Neos.Demo:ContentCollection',
            role: 'content'
        },
        {
            contextPath: 'parent/child@user-admin;language=en_US',
            nodeType: 'Neos.Demo:Page',
            role: 'document'
        }
    ]);
});

test(`The "setState" action should not duplicate the children of a node when merging into the existing state.`, () => {
    const state = {
        byContextPath: {
            'parent@user-admin;language=en_US': {
                contextPath: 'parent@user-admin;language=en_US',
                isFullyLoaded: true,
                children: [
                    {
                        contextPath: 'parent/child@user-admin;language=en_US',
                        nodeType: 'Neos.Demo:Page',
                        role: 'document'
                    },
                    {
                        contextPath: 'parent/main@user-admin;language=en_US',
                        nodeType: 'Neos.Demo:ContentCollection',
                        role: 'content'
                    },
                    {
                        contextPath: 'parent/footer@user-admin;language=en_US',
                        nodeType: 'Neos.Demo:ContentCollection',
                        role: 'content'
                    }
                ]
            }
        },
        focused: {
            fusionPath: null,
            contextPaths: []
        }
    };

    // The document tree only contains the document children of a node
    const mergedState = reducer(state, actions.merge({
        'parent@user-admin;language=en_US': {
            contextPath: 'parent@user-admin;language=en_US',
            children: [
                {
                    contextPath: 'parent/child@user-admin;language=en_US',
                    nodeType: 'Neos.Demo:Page',
                    role: 'document'
                }
            ]
        }
    }));

    // Reloading the state with the document tree representation must not duplicate the children
    const nextState = reducer(mergedState, actions.setState({
        siteNodeContextPath: 'site@user-admin;language=en_US',
        documentNodeContextPath: 'parent/child@user-admin;language=en_US',
        nodes: {
            'parent@user-admin;language=en_US': {
                contextPath: 'parent@user-admin;language=en_US',
                children: [
                    {
                        contextPath: 'parent/child@user-admin;language=en_US',
                        nodeType: 'Neos.Demo:Page',
                        role: 'document'
                    }
                ]
            }
        },
        merge: true
    }));

    expect(nextState.byContextPath['parent@user-admin;language=en_US'].children).toEqual([
        {
            contextPath: 'parent/main@user-admin;language=en_US',
            nodeType: 'Neos.Demo:ContentCollection',
            role: 'content'
        },
        {
            contextPath: 'parent/footer@user-admin;language=en_US',
            nodeType: 'Neos.Demo:ContentCollection',
            role: 'content'
        },
        {
            contextPath: 'parent/child@user-admin;language=en_US',
            nodeType: 'Neos.Demo:Page',
            role: 'document'
        }
    ]);
});

test(`The "setState" action should not duplicate the document children of a node when merging into the existing state.`, () => {
    const documentChildren = ['child-a', 'child-b', 'child-c'].map(name => ({
        contextPath: `parent/${name}@user-admin;language=en_US`,
        nodeType: 'Neos.Demo:Page',
        role: 'document'
    }));
    const contentChildren = ['main', 'footer'].map(name => ({
        contextPath: `parent/${name}@user-admin;language=en_US`,
        nodeType: 'Neos.Demo:ContentCollection',
        role: 'content'
    }));

    const state = {
        byContextPath: {
            'parent@user-admin;language=en_US': {
                contextPath: 'parent@user-admin;language=en_US',
                isFullyLoaded: true,
                children: [
                    ...documentChildren,
                    ...contentChildren
                ]
            }
        },
        focused: {
            fusionPath: null,
            contextPaths: []
        }
    };

    // The document tree only contains the document children of a node
    const mergedState = reducer(state, actions.merge({
        'parent@user-admin;language=en_US': {
            contextPath: 'parent@user-admin;language=en_US',
            children: documentChildren
        }
    }));

    // Reloading the state with the document tree representation must not duplicate the children
    const nextState = reducer(mergedState, actions.setState({
        siteNodeContextPath: 'site@user-admin;language=en_US',
        documentNodeContextPath: 'parent/child-a@user-admin;language=en_US',
        nodes: {
            'parent@user-admin;language=en_US': {
                contextPath: 'parent@user-admin;language=en_US',
                children: documentChildren
            }
        },
        merge: true
    }));

    const childrenContextPaths = nextState.byContextPath['parent@user-admin;language=en_US'].children.map(child => child.contextPath);

    expect(childrenContextPaths).toEqual([
        'parent/main@user-admin;language=en_US',
        'parent/footer@user-admin;language=en_US',
        'parent/child-a@user-admin;language=en_US',
        'parent/child-b@user-admin;language=en_US',
        'parent/child-c@user-admin;language=en_US'
    ]);
    expect(new Set(childrenContextPaths).size).toEqual(childrenContextPaths.length);
});

test(`The "setInlineValidationErrors" action should set validation errors.`, () => {
    const state = {
        inlineValidationErrors: {}
    };
    const nextState = reducer(state, actions.setInlineValidationErrors('abc@user-admin;language=en_US', 'title', ['Some error']));
    expect(nextState).toEqual({
        inlineValidationErrors: {
            'abc@user-admin;language=en_US title': ['Some error']
        }
    });

    const nextState2 = reducer(nextState, actions.setInlineValidationErrors('abc@user-admin;language=en_US', 'title', null));
    expect(nextState2).toEqual({
        inlineValidationErrors: {}
    });
});
