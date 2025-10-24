import {Editor} from "./Editor";

describe('Editor', () => {
    test('loading state', () => {
        const editor = Editor.fromLoadingState(1);

        expect(editor.isLoading()).toBe(true);
        expect(editor.getReferences()).toStrictEqual({});
        expect(editor.getPropertySchema()).toStrictEqual({});
        expect(editor.getLoadingReferencesCount()).toBe(1);
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(editor.getChange('nodeid', 'myRef')).toBe(null);
    })

    test('load references', () => {
        const editor = Editor.fromLoadingState(1).withReferencesAndConfiguration(
            {
                'myTarget': {
                    targetNodeId: 'myTarget',
                    properties: null,
                    label: 'My Target',
                    breadcrumbs: [],
                    icon: 'question',
                    uri: 'node://myTarget'
                },
            },
            {},
            {}
        );

        expect(editor.isLoading()).toBe(false);
        expect(editor.getReferences()).toStrictEqual({
            'myTarget': {
                targetNodeId: 'myTarget',
                properties: null,
                label: 'My Target',
                breadcrumbs: [],
                icon: 'question',
                uri: 'node://myTarget'
            },
        });
        expect(editor.getPropertySchema()).toStrictEqual({});
        expect(editor.getLoadingReferencesCount()).toBe(1);
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(editor.getChange('nodeid', 'myRef')).toBe(null);
    })

    test('load references and que change', () => {
        const editor = Editor.fromLoadingState(2).withReferencesAndConfiguration(
            {
                'myTarget': {
                    targetNodeId: 'myTarget',
                    properties: null,
                    label: 'My Target',
                    breadcrumbs: [],
                    icon: 'question',
                    uri: 'node://myTarget'
                },
                'mySecondTarget': {
                    targetNodeId: 'mySecondTarget',
                    properties: null,
                    label: 'My Target',
                    breadcrumbs: [],
                    icon: 'question',
                    uri: 'node://mySecondTarget'
                },
            },
            {},
            {}
        );
        expect(editor.isLoading()).toBe(false);
        expect(Object.keys(editor.getReferences())).toStrictEqual(['myTarget', 'mySecondTarget']);
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(editor.getChange('nodeid', 'myRef')).toBe(null);

        const editorNext = editor.withRemovedReference('myTarget');
        expect(editorNext).not.toBe(editor); // immutable

        expect(editorNext.isLoading()).toBe(false);
        expect(Object.keys(editorNext.getReferences())).toStrictEqual(['mySecondTarget']);
        expect(editorNext.isReferencePropertyEditingOpen()).toBe(false);
        expect(editorNext.getChange('nodeid', 'myRef')).toStrictEqual({
            "type": "Neos.Neos.Ui:Reference",
            "subject": "nodeid",
            "payload": {
                "referenceName": "myRef",
                "serializedReferences": [{"properties": null, "targetNodeId": "mySecondTarget"}]
            },
        });
    })

    test('load references and que property change but dismiss', () => {
        let editor = Editor.fromLoadingState(2).withReferencesAndConfiguration(
            {
                'myTarget': {
                    targetNodeId: 'myTarget',
                    properties: null,
                    label: 'My Target',
                    breadcrumbs: [],
                    icon: 'question',
                    uri: 'node://myTarget'
                },
            },
            {},
            {
                myProperty: {
                    type: 'string'
                }
            }
        );
        expect(editor.isLoading()).toBe(false);
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(Object.keys(editor.getReferences())).toStrictEqual(['myTarget']);
        expect(editor.getPropertySchema()).toStrictEqual({
            myProperty: {
                type: 'string'
            }
        });

        editor = editor.withReferencePropertyEditing('myTarget');

        expect(editor.isLoading()).toBe(false);
        expect(editor.isReferencePropertyEditingOpen()).toBe(true);
        expect(Object.keys(editor.getReferences())).toStrictEqual(['myTarget']);
        expect(editor.getChange('nodeid', 'myRef')).toBe(null);

        expect(editor.getReferencePropertyValue('myProperty')).toBe(undefined);

        editor = editor.withReferenceProperty('myProperty', 'myPropertyValue');

        expect(editor.isReferencePropertyEditingOpen()).toBe(true);
        expect(editor.getReferencePropertyValue('myProperty')).toBe('myPropertyValue');

        editor = editor.withDismissedReferencePropertyEditing();
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(editor.getReferencePropertyValue('myProperty')).toBe(undefined);
        expect(editor.getReferences()).toStrictEqual({
            'myTarget': {
                targetNodeId: 'myTarget',
                properties: null,
                label: 'My Target',
                breadcrumbs: [],
                icon: 'question',
                uri: 'node://myTarget'
            },
        });
        expect(editor.getChange('nodeid', 'myRef')).toBe(null);
    })

    test('load references and que property change and apply', () => {
        let editor = Editor.fromLoadingState(2).withReferencesAndConfiguration(
            {
                'myTarget': {
                    targetNodeId: 'myTarget',
                    properties: null,
                    label: 'My Target',
                    breadcrumbs: [],
                    icon: 'question',
                    uri: 'node://myTarget'
                },
            },
            {},
            {
                myProperty: {
                    type: 'string'
                }
            }
        );
        expect(editor.isLoading()).toBe(false);
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(Object.keys(editor.getReferences())).toStrictEqual(['myTarget']);
        expect(editor.getPropertySchema()).toStrictEqual({
            myProperty: {
                type: 'string'
            }
        });

        editor = editor.withReferencePropertyEditing('myTarget');

        expect(editor.isLoading()).toBe(false);
        expect(editor.isReferencePropertyEditingOpen()).toBe(true);
        expect(Object.keys(editor.getReferences())).toStrictEqual(['myTarget']);
        expect(editor.getChange('nodeid', 'myRef')).toBe(null);

        expect(editor.getReferencePropertyValue('myProperty')).toBe(undefined);

        editor = editor.withReferenceProperty('myProperty', 'myPropertyValue');

        expect(editor.isReferencePropertyEditingOpen()).toBe(true);
        expect(editor.getReferencePropertyValue('myProperty')).toBe('myPropertyValue');

        editor = editor.withAppliedReferencePropertyEditing();
        expect(editor.isReferencePropertyEditingOpen()).toBe(false);
        expect(editor.getReferencePropertyValue('myProperty')).toBe(undefined);
        expect(editor.getReferences()).toStrictEqual({
            'myTarget': {
                targetNodeId: 'myTarget',
                properties: {
                    'myProperty': 'myPropertyValue'
                },
                label: 'My Target',
                breadcrumbs: [],
                icon: 'question',
                uri: 'node://myTarget'
            },
        });
        expect(editor.getChange('nodeid', 'myRef')).toStrictEqual({
            "type": "Neos.Neos.Ui:Reference",
            "subject": "nodeid",
            "payload": {
                "referenceName": "myRef",
                "serializedReferences": [{"properties": {'myProperty': 'myPropertyValue'}, "targetNodeId": "myTarget"}]
            },
        });
    })
})
