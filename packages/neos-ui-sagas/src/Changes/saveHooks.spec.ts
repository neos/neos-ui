import {
    applySaveHooksForTransientValue,
    applySaveHooksForTransientValuesMap
} from './saveHooks';

test('applySaveHooksForTransientValue does nothing if a given transient value has no specified saveHooks', () => {
    const transientValue = {value: 1};
    const saveHooksRegistry = {get: jest.fn()};

    const process = applySaveHooksForTransientValue(transientValue, saveHooksRegistry);

    const { value, done } = process.next();

    expect(done).toBe(true);
    expect(value).toBe(1);
});

test('applySaveHooksForTransientValue applies registered save hooks to a given transient value', () => {
    const transientValue = {
        value: 1,
        hooks: {
            'AddNumber': {
                number: 2
            },
            'SubtractNumber': {
                number: 1
            }
        }
    };
    const addNumberHook = jest.fn();
    const subtractNumberHook = jest.fn();
    const saveHooksRegistry = {
        get: jest.fn((id: string) => id === 'AddNumber' ? addNumberHook : subtractNumberHook)
    };

    const process = applySaveHooksForTransientValue(transientValue, saveHooksRegistry);

    process.next();

    expect(saveHooksRegistry.get).toBeCalledWith('AddNumber');
    expect(addNumberHook).toBeCalledWith(1, { number: 2 });

    process.next(3);

    expect(saveHooksRegistry.get).toBeCalledWith('SubtractNumber');
    expect(subtractNumberHook).toBeCalledWith(3, { number: 1 });

    const { value, done } = process.next(2);

    expect(done).toBe(true);
    expect(value).toBe(2);
});

test('applySaveHooksForTransientValue will throw an error if a specified saveHook cannot be found', () => {
    const transientValue = {
        value: 1,
        hooks: {
            'AddNumber': {
                number: 2
            }
        }
    };
    const saveHooksRegistry = {
        get: jest.fn()
    };

    const process = applySaveHooksForTransientValue(transientValue, saveHooksRegistry);

    expect(() => process.next()).toThrow();
    expect(saveHooksRegistry.get).toBeCalledWith('AddNumber');
});

test('applySaveHooksForTransientValue will throw an error if a specified saveHook throws an error', () => {
    const transientValue = {
        value: 1,
        hooks: {
            'AddNumber': {
                number: 2
            }
        }
    };
    const saveHooksRegistry = {
        get: jest.fn(() => () => { throw new Error(); })
    };

    const process = applySaveHooksForTransientValue(transientValue, saveHooksRegistry);

    expect(() => process.next()).toThrow();
    expect(saveHooksRegistry.get).toBeCalledWith('AddNumber');
});

test('applySaveHooksForTransientValuesMap applies registered save hooks to multiple transient values', () => {
    const transientValuesMap = {
        width: {
            value: 100,
            hooks: {
                'Multiply': {
                    by: 10
                }
            }
        },
        height: {
            value: 100,
            hooks: {
                'Multiply': {
                    by: 5
                }
            }
        }
    };
    const multiplyHook = jest.fn();
    const saveHooksRegistry = {
        get: jest.fn(() => multiplyHook)
    };
    const process = applySaveHooksForTransientValuesMap(
        transientValuesMap,
        saveHooksRegistry
    );

    process.next();

    expect(saveHooksRegistry.get).toBeCalledWith('Multiply');
    expect(multiplyHook).toBeCalledWith(100, { by: 10 });

    process.next(1000);

    expect(saveHooksRegistry.get).toBeCalledWith('Multiply');
    expect(multiplyHook).toBeCalledWith(100, { by: 5 });

    const { value, done } = process.next(500);

    expect(done).toBe(true);
    expect(value).toEqual({
        width: 1000,
        height: 500
    });
});
