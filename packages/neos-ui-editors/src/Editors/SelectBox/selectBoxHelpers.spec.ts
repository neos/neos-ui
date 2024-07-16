import {processSelectBoxOptions} from './selectBoxHelpers';
import {I18nRegistry} from '@neos-project/neos-ts-interfaces';

const fakeI18NRegistry: I18nRegistry = {
    translate: (id) => id ?? ''
};

describe('processSelectBoxOptions', () => {
    it('transforms an associative array with labels to list of objects', () => {
        const processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'},
            'key2': {label: 'Key 2', icon: 'foo', disabled: true}
        }, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}, {value: 'key2', label: 'Key 2', icon: 'foo', disabled: true}]);
    });

    it('keeps valid shape of list of objects intact', () => {
        const options = [{value: 'key1', label: 'Key 1'}, {value: 'key2', label: 'Key 2', icon: 'foo', disabled: true}];
        const processOptions = processSelectBoxOptions(fakeI18NRegistry, options, null);

        expect(processOptions).toEqual(options);
    });

    it('overrules the array key with the explicit value', () => {
        const processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'},
            // @ts-expect-error we declare the typescript types to what we want, but cant influence user input
            'key2': {label: 'Key 2', value: 'key2-overrule'}
        }, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}, {value: 'key2-overrule', label: 'Key 2'}]);
    });

    it('uses numeric string array key for list of objects', () => {
        const processOptions = processSelectBoxOptions(fakeI18NRegistry, [
            {value: 'key1', label: 'Key 1'},
            {label: 'Key 2'}
        ] as any, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}, {value: '1', label: 'Key 2'}]);
    });

    it('omits entries that are invalid and empty', () => {
        let processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'},
            // @ts-expect-error we declare the typescript types to what we want, but cant influence user input
            'key2': null
        }, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);

        processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'},
            // @ts-expect-error we declare the typescript types to what we want, but cant influence user input
            'key2': {}
        }, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);

        processOptions = processSelectBoxOptions(fakeI18NRegistry, [
            {value: 'key1', label: 'Key 1'},
            {value: 'key2'}
        ] as any, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);

        processOptions = processSelectBoxOptions(fakeI18NRegistry, [
            {value: 'key1', label: 'Key 1'},
            {}
        ] as any, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);
    });

    it('creates missing option for unmatched string value', () => {
        const processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'}
        }, 'oldValue');

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}, {value: 'oldValue', label: 'Neos.Neos.Ui:Main:invalidValue: "oldValue"', icon: 'exclamation-triangle'}]);
    });

    it('creates missing options for unmatched additional array value', () => {
        const processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'}
        }, ['oldValue', 'key1']);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}, {value: 'oldValue', label: 'Neos.Neos.Ui:Main:invalidValue: "oldValue"', icon: 'exclamation-triangle'}]);
    });

    it('creates missing options for unmatched additional multiple array values', () => {
        const processOptions = processSelectBoxOptions(
            fakeI18NRegistry,
            [{value: 'key1', label: 'Key 1'}, {value: 'key2', label: 'Key 2'}, {value: 'key3', label: 'Key 3'}],
            ['oldValue', 'key1', 'oldValue2']
        );

        expect(processOptions).toEqual([
            {value: 'key1', label: 'Key 1'},
            {value: 'key2', label: 'Key 2'},
            {value: 'key3', label: 'Key 3'},
            {value: 'oldValue', label: 'Neos.Neos.Ui:Main:invalidValue: "oldValue"', icon: 'exclamation-triangle'},
            {value: 'oldValue2', label: 'Neos.Neos.Ui:Main:invalidValue: "oldValue2"', icon: 'exclamation-triangle'}
        ]);
    });

    it('ignored current value being empty and dont create missing option', () => {
        let processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'}
        }, null);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);

        processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'}
        }, undefined);

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);

        processOptions = processSelectBoxOptions(fakeI18NRegistry, {
            'key1': {label: 'Key 1'}
        }, '');

        expect(processOptions).toEqual([{value: 'key1', label: 'Key 1'}]);
    });
});
