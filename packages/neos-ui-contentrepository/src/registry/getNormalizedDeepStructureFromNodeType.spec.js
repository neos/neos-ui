import getNormalizedDeepStructureFromNodeType from './getNormalizedDeepStructureFromNodeType';

test(`
    "getNormalizedDeepStructureFromNodeType" should sort things correctly`, () => {
    const nodeType = {
        properties: {
            last: {
                ui: {
                    label: 'last',
                    inspector: {
                        position: 100
                    }
                }
            },
            notPositionedOne: {
                ui: {
                    label: 'notPositionedOne'
                }
            },
            notPositionedTwo: {
                ui: {
                    label: 'notPositionedTwo'
                }
            },
            first: {
                ui: {
                    label: 'first',
                    inspector: {
                        position: 1
                    }
                }
            }
        }
    };

    const expectedResult = [
        {
            id: 'first',
            ui: {
                label: 'first',
                inspector: {
                    position: 1
                }
            }
        },
        {
            id: 'last',
            ui: {
                label: 'last',
                inspector: {
                    position: 100
                }
            }
        },
        {
            id: 'notPositionedOne',
            ui: {
                label: 'notPositionedOne'
            }
        },
        {
            id: 'notPositionedTwo',
            ui: {
                label: 'notPositionedTwo'
            }
        }
    ];

    const sortedProperties = getNormalizedDeepStructureFromNodeType('properties')(nodeType);
    expect(sortedProperties).toEqual(expectedResult);
});
