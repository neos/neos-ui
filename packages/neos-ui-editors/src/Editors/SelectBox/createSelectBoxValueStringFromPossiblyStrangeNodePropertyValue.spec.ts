import {createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue} from './createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue';

describe('createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue', () => {
    it('accepts value of type "string" and returns a "string"', () => {
        const value =
            createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue(
                'I am already a valid select box value, believe it or not.'
            );

        expect(value).toEqual(
            'I am already a valid select box value, believe it or not.'
        );
    });

    it('accepts an object identity DTO and returns a "string"', () => {
        const value =
            createSelectBoxValueStringFromPossiblyStrangeNodePropertyValue({
                __identity: 'de93b358-cb77-422e-b295-2f219bfc4dfb',
                __type: 'Neos\\Media\\Domain\\Model\\Tag'
            });

        expect(value).toEqual('de93b358-cb77-422e-b295-2f219bfc4dfb');
    });
});
