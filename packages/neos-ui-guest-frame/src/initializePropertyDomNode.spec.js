import {isPropertyInlineEditable} from './initializePropertyDomNode';

const nodeType = {
    properties: {
        title: {ui: {inlineEditable: true}},
        text: {},
        assetIdentifier: {ui: {inlineEditable: false}}
    }
};

describe('node type configuration', () => {
    test('property that is configured as inline editable is editable', () => {
        expect(isPropertyInlineEditable({nodeType, propertyName: 'title'})).toBe(true);
    });

    test('property without inline editor configuration is editable', () => {
        expect(isPropertyInlineEditable({nodeType, propertyName: 'text'})).toBe(true);
    });

    test('property that is configured as not inline editable is not editable', () => {
        expect(isPropertyInlineEditable({nodeType, propertyName: 'assetIdentifier'})).toBe(false);
    });
});

describe('node policy', () => {
    test('property of a node the user may edit is editable', () => {
        const nodePolicy = {canEdit: true, disallowedProperties: []};

        expect(isPropertyInlineEditable({nodeType, propertyName: 'title', nodePolicy})).toBe(true);
    });

    test('property of a node the user may not edit is not editable', () => {
        const nodePolicy = {canEdit: false, disallowedProperties: []};

        expect(isPropertyInlineEditable({nodeType, propertyName: 'title', nodePolicy})).toBe(false);
    });

    test('property that is disallowed for the user is not editable', () => {
        const nodePolicy = {canEdit: true, disallowedProperties: ['title']};

        expect(isPropertyInlineEditable({nodeType, propertyName: 'title', nodePolicy})).toBe(false);
    });

    test('property is editable while the policy has not been loaded yet', () => {
        expect(isPropertyInlineEditable({nodeType, propertyName: 'title', nodePolicy: undefined})).toBe(true);
    });
});
